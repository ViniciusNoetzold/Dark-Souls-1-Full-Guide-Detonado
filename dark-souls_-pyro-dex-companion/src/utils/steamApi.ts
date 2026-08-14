import { fetch } from '@tauri-apps/plugin-http';

// Steam DS1 App IDs: 570940 (Dark Souls: Remastered), 211420 (Dark Souls: Prepare to Die Edition)

export async function resolveVanity(vanity: string) {
  if (/^\d{17}$/.test(vanity.trim())) {
    return { steamId: vanity.trim(), resolved: true };
  }

  try {
    const resXml = await fetch(`https://steamcommunity.com/id/${encodeURIComponent(vanity.trim())}/?xml=1`, {
      method: 'GET',
    });
    const xml = await resXml.text();
    const id64Match = xml.match(/<steamID64>(\d+)<\/steamID64>/);
    if (id64Match && id64Match[1]) {
      return { steamId: id64Match[1], resolved: true, fromCommunityXml: true };
    }
  } catch (err) {
    console.warn('Community XML vanity lookup failed:', err);
  }

  return {
    steamId: vanity.trim(),
    resolved: false,
    message: 'Para sincronização automática via nome de usuário, use seu SteamID64 numérico (17 dígitos).',
  };
}

export async function getPlayerSummary(steamId: string) {
  try {
    const profileUrl = /^\d{17}$/.test(steamId.trim())
      ? `https://steamcommunity.com/profiles/${steamId.trim()}/?xml=1`
      : `https://steamcommunity.com/id/${encodeURIComponent(steamId.trim())}/?xml=1`;

    const resXml = await fetch(profileUrl, { method: 'GET' });
    const xml = await resXml.text();

    const personaNameMatch = xml.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/) || xml.match(/<steamID>(.*?)<\/steamID>/);
    const avatarMatch = xml.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || xml.match(/<avatarFull>(.*?)<\/avatarFull>/);
    const stateMessageMatch = xml.match(/<stateMessage><!\[CDATA\[(.*?)\]\]><\/stateMessage>/) || xml.match(/<stateMessage>(.*?)<\/stateMessage>/);
    const gameNameMatch = xml.match(/<gameName><!\[CDATA\[(.*?)\]\]><\/gameName>/) || xml.match(/<gameName>(.*?)<\/gameName>/);
    const onlineStateMatch = xml.match(/<onlineState>(.*?)<\/onlineState>/);

    if (personaNameMatch || avatarMatch) {
      const isPlayingDS = Boolean(
        gameNameMatch?.[1]?.toLowerCase().includes('dark souls') ||
        stateMessageMatch?.[1]?.toLowerCase().includes('dark souls')
      );

      return {
        steamid: steamId,
        personaname: personaNameMatch?.[1] || `Chosen Undead (${steamId.slice(-4)})`,
        profileurl: `https://steamcommunity.com/profiles/${steamId}`,
        avatarfull: avatarMatch?.[1] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
        personastate: onlineStateMatch?.[1] === 'online' || onlineStateMatch?.[1] === 'in-game' ? 1 : 0,
        gameextrainfo: gameNameMatch?.[1] || (isPlayingDS ? 'DARK SOULS™: REMASTERED' : undefined),
        gameid: isPlayingDS ? '570940' : undefined,
        fromCommunityXml: true,
      };
    }
  } catch (err) {
    console.warn('Community XML player summary lookup failed:', err);
  }

  // Fallback
  return {
    steamid: steamId,
    personaname: `Chosen Undead (${steamId.slice(-4)})`,
    profileurl: `https://steamcommunity.com/profiles/${steamId}`,
    avatarfull: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
    personastate: 1,
    gameextrainfo: 'DARK SOULS™: REMASTERED',
    gameid: '570940',
    simulated: true,
  };
}

export async function getAchievements(steamId: string, appId: number = 570940) {
  try {
    const statsUrl = /^\d{17}$/.test(steamId.trim())
      ? `https://steamcommunity.com/profiles/${steamId.trim()}/stats/${appId}/?xml=1`
      : `https://steamcommunity.com/id/${encodeURIComponent(steamId.trim())}/stats/${appId}/?xml=1`;

    const resXml = await fetch(statsUrl, { method: 'GET' });
    const xml = await resXml.text();

    const achievements: Array<{ apiname: string; achieved: number; unlocktime: number }> = [];
    const achRegex = /<achievement closed=\"([01])\">[\s\S]*?<apiname><!\[CDATA\[(.*?)\]\]><\/apiname>[\s\S]*?<unlockTimestamp>(.*?)<\/unlockTimestamp>/g;
    let match;
    while ((match = achRegex.exec(xml)) !== null) {
      achievements.push({
        apiname: match[2],
        achieved: parseInt(match[1], 10),
        unlocktime: parseInt(match[3], 10) || 0,
      });
    }

    // Process specific DSR achievements mapping based on original logic if needed,
    // actually returning them directly works since the UI parses `apiname` / `achieved`
    
    return achievements;
  } catch (err) {
    console.error('Error fetching achievements via XML:', err);
    return [];
  }
}
