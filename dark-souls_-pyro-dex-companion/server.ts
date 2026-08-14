import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Steam DS1 App IDs: 570940 (Dark Souls: Remastered), 211420 (Dark Souls: Prepare to Die Edition)
const DS1_APP_IDS = [570940, 211420];

// In-memory cache for Steam responses to respect rate limits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// Helper to resolve Steam Vanity URL to 64bit Steam ID
app.get('/api/steam/resolve-vanity', async (req, res) => {
  try {
    const vanity = req.query.vanity as string;
    const apiKey = process.env.STEAM_API_KEY;

    if (!vanity) {
      return res.status(400).json({ error: 'vanity URL parameter is required' });
    }

    // If it's already a 17-digit numeric SteamID64, return directly
    if (/^\d{17}$/.test(vanity.trim())) {
      return res.json({ steamId: vanity.trim(), resolved: true });
    }

    const cacheKey = `vanity:${vanity}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    if (!apiKey) {
      // Fallback: Try resolving via public Steam Community XML
      try {
        const resXml = await fetch(`https://steamcommunity.com/id/${encodeURIComponent(vanity.trim())}/?xml=1`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const xml = await resXml.text();
        const id64 = xml.match(/<steamID64>(\d+)<\/steamID64>/)?.[1];
        if (id64) {
          const result = { steamId: id64, resolved: true, fromCommunityXml: true };
          cache.set(cacheKey, { data: result, timestamp: Date.now() });
          return res.json(result);
        }
      } catch (xmlErr) {
        console.warn('Community XML vanity lookup failed:', xmlErr);
      }

      return res.json({
        steamId: vanity.trim(),
        resolved: false,
        message: 'Para sincronização automática via nome de usuário, use seu SteamID64 numérico (17 dígitos) ou adicione STEAM_API_KEY.',
      });
    }

    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(vanity)}`
    );
    const data = await response.json();

    if (data.response && data.response.success === 1) {
      const result = { steamId: data.response.steamid, resolved: true };
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return res.json(result);
    } else {
      return res.status(404).json({ error: 'Could not resolve Steam vanity username' });
    }
  } catch (err: any) {
    console.error('Error resolving Steam vanity:', err);
    return res.status(500).json({ error: 'Failed to resolve vanity URL', details: err.message });
  }
});

// Steam Player Profile & Status
app.get('/api/steam/player-summary', async (req, res) => {
  try {
    const steamId = req.query.steamId as string;
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamId) {
      return res.status(400).json({ error: 'steamId parameter is required' });
    }

    if (!apiKey) {
      // Try resolving actual public steam profile details from Steam Community XML
      try {
        const profileUrl = /^\d{17}$/.test(steamId.trim())
          ? `https://steamcommunity.com/profiles/${steamId.trim()}/?xml=1`
          : `https://steamcommunity.com/id/${encodeURIComponent(steamId.trim())}/?xml=1`;

        const resXml = await fetch(profileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

          const result = {
            steamid: steamId,
            personaname: personaNameMatch?.[1] || `Chosen Undead (${steamId.slice(-4)})`,
            profileurl: `https://steamcommunity.com/profiles/${steamId}`,
            avatarfull: avatarMatch?.[1] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
            personastate: onlineStateMatch?.[1] === 'online' || onlineStateMatch?.[1] === 'in-game' ? 1 : 0,
            gameextrainfo: gameNameMatch?.[1] || (isPlayingDS ? 'DARK SOULS™: REMASTERED' : undefined),
            gameid: isPlayingDS ? '570940' : undefined,
            fromCommunityXml: true,
          };
          cache.set(`summary:${steamId}`, { data: result, timestamp: Date.now() });
          return res.json(result);
        }
      } catch (xmlErr) {
        console.warn('Community XML player summary lookup failed:', xmlErr);
      }

      // Return a simulated player profile based on steamId for preview/testing
      return res.json({
        steamid: steamId,
        personaname: `Chosen Undead (${steamId.slice(-4)})`,
        profileurl: `https://steamcommunity.com/profiles/${steamId}`,
        avatarfull: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
        personastate: 1,
        gameextrainfo: 'DARK SOULS™: REMASTERED',
        gameid: '570940',
        simulated: true,
      });
    }

    const cacheKey = `summary:${steamId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${encodeURIComponent(steamId)}`
    );
    const data = await response.json();

    if (data.response && data.response.players && data.response.players.length > 0) {
      const player = data.response.players[0];
      cache.set(cacheKey, { data: player, timestamp: Date.now() });
      return res.json(player);
    } else {
      return res.status(404).json({ error: 'Player not found on Steam' });
    }
  } catch (err: any) {
    console.error('Error fetching Steam player summary:', err);
    return res.status(500).json({ error: 'Failed to fetch player summary', details: err.message });
  }
});

// Steam Achievements for Dark Souls 1
app.get('/api/steam/achievements', async (req, res) => {
  try {
    const steamId = req.query.steamId as string;
    const appId = req.query.appId ? parseInt(req.query.appId as string, 10) : 570940;
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamId) {
      return res.status(400).json({ error: 'steamId parameter is required' });
    }

    if (!apiKey) {
      // Try resolving public achievements from Steam Community XML
      try {
        const statsUrl = /^\d{17}$/.test(steamId.trim())
          ? `https://steamcommunity.com/profiles/${steamId.trim()}/stats/${appId}/?xml=1`
          : `https://steamcommunity.com/id/${encodeURIComponent(steamId.trim())}/stats/${appId}/?xml=1`;

        const resXml = await fetch(statsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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

        if (achievements.length > 0) {
          const result = {
            appId,
            gameName: 'DARK SOULS™: REMASTERED',
            success: true,
            achievements,
            fromCommunityXml: true,
          };
          cache.set(`achievements:${steamId}:${appId}`, { data: result, timestamp: Date.now() });
          return res.json(result);
        }
      } catch (xmlErr) {
        console.warn('Community XML achievements lookup failed:', xmlErr);
      }

      return res.json({
        simulated: true,
        appId,
        message: 'No STEAM_API_KEY configured. Usando rastreador offline / sincronização manual.',
        achievements: [],
      });
    }

    const cacheKey = `achievements:${steamId}:${appId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${encodeURIComponent(steamId)}&l=brazilian`
    );
    const data = await response.json();

    if (data.playerstats && data.playerstats.achievements) {
      const result = {
        appId,
        gameName: data.playerstats.gameName,
        success: data.playerstats.success,
        achievements: data.playerstats.achievements,
      };
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return res.json(result);
    } else {
      // Profile might be private
      return res.status(200).json({
        appId,
        isPrivateOrNoStats: true,
        message: data.playerstats?.error || 'User achievements are private or game not owned.',
        achievements: [],
      });
    }
  } catch (err: any) {
    console.error('Error fetching Steam achievements:', err);
    return res.status(500).json({ error: 'Failed to fetch achievements', details: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasSteamKey: Boolean(process.env.STEAM_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dark Souls Companion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
