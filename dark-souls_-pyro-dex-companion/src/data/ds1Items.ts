export interface DSWeapon {
  id: string;
  name: string;
  weight: number;
  basePhys: number;
  baseMag: number;
  baseFire: number;
  baseLight: number;
  strScal: string;
  dexScal: string;
  isChaos?: boolean;
}

export interface DSArmor {
  id: string;
  name: string;
  weight: number;
  poise: number;
  physDef: number;
  magDef: number;
  fireDef: number;
  lightDef: number;
  bleedRes: number;
  poisonRes: number;
  curseRes: number;
}

export interface DSRing {
  id: string;
  name: string;
  weight: number;
  effect: string;
}

export interface DSSpell {
  id: string;
  name: string;
  slotsUsed: number;
  type: 'pyro' | 'sorcery' | 'miracle';
}

export interface DSItem {
  id: string;
  name: string;
}

export const WEAPONS: DSWeapon[] = [
  { id: 'none', name: 'Nenhuma', weight: 0.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: '-', dexScal: '-' },
  
  // Daggers & Rapiers
  { id: 'rapier_15', name: 'Rapier +15', weight: 1.5, basePhys: 184, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: 'B' },
  { id: 'ricards_rapier_15', name: "Ricard's Rapier +15", weight: 2.0, basePhys: 160, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'A' },
  { id: 'dark_silver_tracer_5', name: 'Dark Silver Tracer +5', weight: 1.0, basePhys: 165, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'S' },

  // Katanas
  { id: 'uchigatana_15', name: 'Uchigatana +15', weight: 5.0, basePhys: 225, baseMag: 0, baseFire: 0, baseLight: 0, strScal: '-', dexScal: 'A' },
  { id: 'iaito_15', name: 'Iaito +15', weight: 5.0, basePhys: 220, baseMag: 0, baseFire: 0, baseLight: 0, strScal: '-', dexScal: 'A' },
  { id: 'chaos_blade_5', name: 'Chaos Blade +5', weight: 6.0, basePhys: 216, baseMag: 0, baseFire: 0, baseLight: 0, strScal: '-', dexScal: 'B', isChaos: true },
  
  // Curved Swords
  { id: 'quelaag_5', name: "Quelaag's Furysword +5", weight: 3.5, basePhys: 90, baseMag: 0, baseFire: 255, baseLight: 0, strScal: 'E', dexScal: 'B', isChaos: true },
  { id: 'falchion_15', name: 'Falchion +15', weight: 2.5, basePhys: 205, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'A' },
  { id: 'gold_tracer_5', name: 'Gold Tracer +5', weight: 1.5, basePhys: 195, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'A' },
  { id: 'server_15', name: 'Server +15 (Curved GS)', weight: 10.0, basePhys: 265, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'C', dexScal: 'C' },

  // Straight Swords & GS
  { id: 'bss_15', name: 'Balder Side Sword +15', weight: 3.0, basePhys: 200, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'A' },
  { id: 'claymore_15', name: 'Claymore +15', weight: 6.0, basePhys: 257, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'C', dexScal: 'C' },
  { id: 'black_knight_sword_5', name: 'Black Knight Sword +5', weight: 8.0, basePhys: 330, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'C', dexScal: 'E' },

  // Spears & Halberds
  { id: 'partizan_15', name: 'Partizan +15', weight: 4.5, basePhys: 200, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: 'B' },
  { id: 'partizan_lightning_5', name: 'Partizan Lightning +5', weight: 4.5, basePhys: 200, baseMag: 0, baseFire: 0, baseLight: 204, strScal: '-', dexScal: '-' },
  { id: 'winged_spear_15', name: 'Winged Spear +15', weight: 4.5, basePhys: 212, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'C' },
  { id: 'silver_spear_5', name: 'Silver Knight Spear +5', weight: 6.0, basePhys: 244, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'C' },
  { id: 'great_scythe_15', name: 'Great Scythe +15', weight: 5.0, basePhys: 250, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'E', dexScal: 'A' },
  { id: 'gargoyle_halberd_15', name: 'Gargoyle\'s Halberd +15', weight: 6.0, basePhys: 287, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: 'E' },

  // Casting
  { id: 'pyro_flame', name: 'Pyromancy Flame (Ascended)', weight: 0.0, basePhys: 0, baseMag: 0, baseFire: 270, baseLight: 0, strScal: '-', dexScal: '-' },
];

export const SHIELDS: DSWeapon[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: '-', dexScal: '-' },
  { id: 'heater_shield', name: 'Heater Shield', weight: 2.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'grass_crest', name: 'Grass Crest Shield', weight: 3.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'crest_shield', name: 'Crest Shield', weight: 3.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'spider_shield', name: 'Spider Shield', weight: 3.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'bloodshield', name: 'Bloodshield', weight: 3.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'silver_knight_shield', name: 'Silver Knight Shield', weight: 5.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'black_knight', name: 'Black Knight Shield', weight: 6.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
  { id: 'eagle_shield', name: 'Eagle Shield', weight: 6.0, basePhys: 0, baseMag: 0, baseFire: 0, baseLight: 0, strScal: 'D', dexScal: '-' },
];

export const HEAD_ARMOR: DSArmor[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, poise: 0, physDef: 0, magDef: 0, fireDef: 0, lightDef: 0, bleedRes: 0, poisonRes: 0, curseRes: 0 },
  { id: 'gold_hemmed_head', name: 'Gold-Hemmed Black Hood', weight: 1.4, poise: 0, physDef: 14, magDef: 20, fireDef: 24, lightDef: 14, bleedRes: 15, poisonRes: 25, curseRes: 0 },
  { id: 'shadow_mask', name: 'Shadow Mask', weight: 1.2, poise: 0, physDef: 9, magDef: 8, fireDef: 9, lightDef: 9, bleedRes: 20, poisonRes: 30, curseRes: 0 },
  { id: 'mask_child', name: 'Mask of the Child (Stamina+)', weight: 1.2, poise: 0, physDef: 8, magDef: 10, fireDef: 8, lightDef: 10, bleedRes: 10, poisonRes: 10, curseRes: 0 },
  { id: 'mask_mother', name: 'Mask of the Mother (HP+)', weight: 1.2, poise: 0, physDef: 8, magDef: 10, fireDef: 8, lightDef: 10, bleedRes: 10, poisonRes: 10, curseRes: 0 },
  { id: 'crown_dusk', name: 'Crown of Dusk (Magic+)', weight: 0.4, poise: 0, physDef: 4, magDef: 14, fireDef: 4, lightDef: 4, bleedRes: 0, poisonRes: 0, curseRes: 0 },
  { id: 'elite_knight_helm', name: 'Elite Knight Helm', weight: 5.5, poise: 12, physDef: 26, magDef: 12, fireDef: 14, lightDef: 11, bleedRes: 15, poisonRes: 0, curseRes: 0 },
  { id: 'havel_helm', name: 'Havel\'s Helm', weight: 11.3, poise: 28, physDef: 38, magDef: 36, fireDef: 36, lightDef: 36, bleedRes: 20, poisonRes: 20, curseRes: 0 },
  { id: 'dingy_hood', name: 'Dingy Hood', weight: 1.0, poise: 0, physDef: 8, magDef: 16, fireDef: 10, lightDef: 14, bleedRes: 12, poisonRes: 16, curseRes: 20 },
];

export const CHEST_ARMOR: DSArmor[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, poise: 0, physDef: 0, magDef: 0, fireDef: 0, lightDef: 0, bleedRes: 0, poisonRes: 0, curseRes: 0 },
  { id: 'gold_hemmed_chest', name: 'Gold-Hemmed Black Cloak', weight: 3.6, poise: 0, physDef: 35, magDef: 51, fireDef: 60, lightDef: 35, bleedRes: 39, poisonRes: 63, curseRes: 0 },
  { id: 'shadow_garb', name: 'Shadow Garb', weight: 3.2, poise: 0, physDef: 25, magDef: 23, fireDef: 25, lightDef: 25, bleedRes: 52, poisonRes: 79, curseRes: 0 },
  { id: 'wanderer_coat', name: 'Wanderer Coat', weight: 3.9, poise: 0, physDef: 31, magDef: 34, fireDef: 19, lightDef: 23, bleedRes: 30, poisonRes: 25, curseRes: 0 },
  { id: 'elite_knight_armor', name: 'Elite Knight Armor', weight: 11.7, poise: 20, physDef: 67, magDef: 31, fireDef: 36, lightDef: 27, bleedRes: 39, poisonRes: 0, curseRes: 0 },
  { id: 'havel_armor', name: 'Havel\'s Armor', weight: 33.8, poise: 47, physDef: 92, magDef: 86, fireDef: 86, lightDef: 86, bleedRes: 47, poisonRes: 47, curseRes: 0 },
  { id: 'crimson_robe', name: 'Crimson Robe', weight: 3.0, poise: 0, physDef: 28, magDef: 36, fireDef: 25, lightDef: 25, bleedRes: 26, poisonRes: 35, curseRes: 30 },
  { id: 'dingy_robe', name: 'Dingy Robe', weight: 3.0, poise: 0, physDef: 22, magDef: 42, fireDef: 26, lightDef: 36, bleedRes: 32, poisonRes: 42, curseRes: 53 },
];

export const HAND_ARMOR: DSArmor[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, poise: 0, physDef: 0, magDef: 0, fireDef: 0, lightDef: 0, bleedRes: 0, poisonRes: 0, curseRes: 0 },
  { id: 'gold_hemmed_hands', name: 'Gold-Hemmed Black Gloves', weight: 1.2, poise: 0, physDef: 14, magDef: 20, fireDef: 24, lightDef: 14, bleedRes: 15, poisonRes: 25, curseRes: 0 },
  { id: 'shadow_gauntlets', name: 'Shadow Gauntlets', weight: 1.2, poise: 0, physDef: 9, magDef: 8, fireDef: 9, lightDef: 9, bleedRes: 20, poisonRes: 30, curseRes: 0 },
  { id: 'elite_knight_gauntlets', name: 'Elite Knight Gauntlets', weight: 4.6, poise: 6, physDef: 19, magDef: 10, fireDef: 13, lightDef: 8, bleedRes: 11, poisonRes: 0, curseRes: 0 },
  { id: 'havel_gauntlets', name: 'Havel\'s Gauntlets', weight: 11.3, poise: 28, physDef: 38, magDef: 36, fireDef: 36, lightDef: 36, bleedRes: 20, poisonRes: 20, curseRes: 0 },
  { id: 'iron_bracelet', name: 'Iron Bracelet (Solaire)', weight: 3.5, poise: 7, physDef: 17, magDef: 8, fireDef: 10, lightDef: 10, bleedRes: 9, poisonRes: 9, curseRes: 0 },
];

export const LEG_ARMOR: DSArmor[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, poise: 0, physDef: 0, magDef: 0, fireDef: 0, lightDef: 0, bleedRes: 0, poisonRes: 0, curseRes: 0 },
  { id: 'gold_hemmed_legs', name: 'Gold-Hemmed Black Skirt', weight: 3.6, poise: 0, physDef: 35, magDef: 51, fireDef: 60, lightDef: 35, bleedRes: 39, poisonRes: 63, curseRes: 0 },
  { id: 'shadow_leggings', name: 'Shadow Leggings', weight: 1.9, poise: 0, physDef: 15, magDef: 14, fireDef: 15, lightDef: 15, bleedRes: 31, poisonRes: 47, curseRes: 0 },
  { id: 'wanderer_boots', name: 'Wanderer Boots', weight: 3.5, poise: 0, physDef: 27, magDef: 30, fireDef: 17, lightDef: 21, bleedRes: 26, poisonRes: 21, curseRes: 0 },
  { id: 'elite_knight_leggings', name: 'Elite Knight Leggings', weight: 8.0, poise: 10, physDef: 35, magDef: 17, fireDef: 21, lightDef: 14, bleedRes: 20, poisonRes: 0, curseRes: 0 },
  { id: 'havel_leggings', name: 'Havel\'s Leggings', weight: 11.3, poise: 28, physDef: 38, magDef: 36, fireDef: 36, lightDef: 36, bleedRes: 20, poisonRes: 20, curseRes: 0 },
  { id: 'crimson_waistcloth', name: 'Crimson Waistcloth', weight: 3.0, poise: 0, physDef: 28, magDef: 36, fireDef: 25, lightDef: 25, bleedRes: 26, poisonRes: 35, curseRes: 30 },
  { id: 'blood_stained_skirt', name: 'Blood-Stained Skirt (Dingy)', weight: 3.0, poise: 0, physDef: 22, magDef: 42, fireDef: 26, lightDef: 36, bleedRes: 32, poisonRes: 42, curseRes: 53 },
];

export const RINGS: DSRing[] = [
  { id: 'none', name: 'Nenhum', weight: 0.0, effect: '' },
  { id: 'bellowing', name: 'Bellowing Dragoncrest Ring', weight: 0.0, effect: '+20% Pyro Damage' },
  { id: 'dwgr', name: 'Dark Wood Grain Ring', weight: 0.0, effect: 'Ninja Flip (<25%)' },
  { id: 'fap', name: 'Ring of Favor and Protection', weight: 0.0, effect: '+20% HP/Stam/Equip' },
  { id: 'havel', name: "Havel's Ring", weight: 0.0, effect: '+50% Equip Load' },
  { id: 'wolf', name: 'Wolf Ring', weight: 0.0, effect: '+40 Poise' },
  { id: 'steel_protection', name: 'Ring of Steel Protection', weight: 0.0, effect: '+50 Phys Def' },
  { id: 'cgsr', name: 'Covetous Gold Serpent Ring', weight: 0.0, effect: '+200 Item Discovery' },
  { id: 'hornet', name: 'Hornet Ring', weight: 0.0, effect: '+30% Critical Dmg' },
  { id: 'chloranthy', name: 'Chloranthy Ring', weight: 0.0, effect: 'Stamina Regen Up' },
  { id: 'rtsr', name: 'Red Tearstone Ring', weight: 0.0, effect: '+50% Dmg at <20% HP' },
  { id: 'slumbering', name: 'Slumbering Dragoncrest Ring', weight: 0.0, effect: 'Silent Movement' },
];

export const SPELLS: DSSpell[] = [
  { id: 'none', name: 'Nenhum', slotsUsed: 0, type: 'pyro' },
  { id: 'fireball', name: 'Fireball', slotsUsed: 1, type: 'pyro' },
  { id: 'fire_orb', name: 'Fire Orb', slotsUsed: 1, type: 'pyro' },
  { id: 'great_fireball', name: 'Great Fireball', slotsUsed: 1, type: 'pyro' },
  { id: 'great_chaos_fireball', name: 'Great Chaos Fireball', slotsUsed: 2, type: 'pyro' },
  { id: 'combustion', name: 'Combustion', slotsUsed: 1, type: 'pyro' },
  { id: 'great_combustion', name: 'Great Combustion', slotsUsed: 1, type: 'pyro' },
  { id: 'black_flame', name: 'Black Flame', slotsUsed: 1, type: 'pyro' },
  { id: 'power_within', name: 'Power Within', slotsUsed: 1, type: 'pyro' },
  { id: 'iron_flesh', name: 'Iron Flesh', slotsUsed: 1, type: 'pyro' },
  { id: 'flash_sweat', name: 'Flash Sweat', slotsUsed: 1, type: 'pyro' },
  { id: 'poison_mist', name: 'Poison Mist', slotsUsed: 1, type: 'pyro' },
  { id: 'toxic_mist', name: 'Toxic Mist', slotsUsed: 1, type: 'pyro' },
  { id: 'fire_tempest', name: 'Fire Tempest', slotsUsed: 1, type: 'pyro' },
  { id: 'chaos_storm', name: 'Chaos Storm', slotsUsed: 2, type: 'pyro' },
];

export const QUICK_ITEMS: DSItem[] = [
  { id: 'none', name: 'Vazio' },
  { id: 'estus', name: 'Estus Flask' },
  { id: 'green_blossom', name: 'Green Blossom' },
  { id: 'homeward_bone', name: 'Homeward Bone' },
  { id: 'charcoal_pine', name: 'Charcoal Pine Resin' },
  { id: 'gold_pine', name: 'Gold Pine Resin' },
  { id: 'black_firebomb', name: 'Black Firebomb' },
  { id: 'dung_pie', name: 'Dung Pie' },
  { id: 'poison_knife', name: 'Poison Throwing Knife' },
  { id: 'lloyd_talisman', name: 'Lloyd\'s Talisman' },
  { id: 'purple_moss', name: 'Purple Moss Clump' },
  { id: 'blooming_moss', name: 'Blooming Purple Moss' },
];

export type AppStats = {
  vit: number;
  att: number;
  end: number;
  str: number;
  dex: number;
  res: number;
  int: number;
  fth: number;
  humanity: number;
};

export const SNAPSHOTS: Record<string, { label: string; stats: AppStats; equipment: any }> = {
  ep10: {
    label: 'Episódio 10 (Sen\'s Fortress)',
    stats: { vit: 20, att: 16, end: 20, str: 13, dex: 24, res: 10, int: 10, fth: 8, humanity: 2 },
    equipment: {
      rh1: 'partizan_lightning_5', rh2: 'pyro_flame', lh1: 'grass_crest', lh2: 'none',
      head: 'shadow_mask', chest: 'wanderer_coat', hands: 'shadow_gauntlets', legs: 'shadow_leggings',
      ring1: 'bellowing', ring2: 'steel_protection',
      spells: ['fireball', 'combustion', 'power_within', 'great_fireball', 'none', 'none', 'none', 'none', 'none', 'none'],
      items: ['estus', 'green_blossom', 'homeward_bone', 'none', 'none']
    }
  },
  ep20: {
    label: 'Episódio 20 (Mid-Late Game)',
    stats: { vit: 25, att: 19, end: 26, str: 14, dex: 30, res: 10, int: 10, fth: 8, humanity: 10 },
    equipment: {
      rh1: 'quelaag_5', rh2: 'pyro_flame', lh1: 'crest_shield', lh2: 'none',
      head: 'gold_hemmed_head', chest: 'gold_hemmed_chest', hands: 'gold_hemmed_hands', legs: 'gold_hemmed_legs',
      ring1: 'bellowing', ring2: 'fap',
      spells: ['great_chaos_fireball', 'none', 'combustion', 'great_combustion', 'power_within', 'none', 'none', 'none', 'none', 'none'],
      items: ['estus', 'green_blossom', 'homeward_bone', 'charcoal_pine', 'none']
    }
  },
  ep36: {
    label: 'Episódio 36 (Platina / NG++)',
    stats: { vit: 40, att: 19, end: 40, str: 16, dex: 45, res: 10, int: 10, fth: 8, humanity: 10 },
    equipment: {
      rh1: 'dark_silver_tracer_5', rh2: 'pyro_flame', lh1: 'black_knight', lh2: 'none',
      head: 'gold_hemmed_head', chest: 'gold_hemmed_chest', hands: 'gold_hemmed_hands', legs: 'gold_hemmed_legs',
      ring1: 'bellowing', ring2: 'dwgr',
      spells: ['great_chaos_fireball', 'none', 'black_flame', 'great_combustion', 'power_within', 'none', 'none', 'none', 'none', 'none'],
      items: ['estus', 'green_blossom', 'homeward_bone', 'dung_pie', 'black_firebomb']
    }
  }
};
