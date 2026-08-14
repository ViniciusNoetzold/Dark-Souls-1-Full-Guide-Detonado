export const calculateScalingBonus = (baseDamage: number, statValue: number, scalingGrade: string): number => {
  if (scalingGrade === '-' || statValue < 10) return 0;
  const multipliers: Record<string, number> = { 'S': 1.4, 'A': 1.0, 'B': 0.8, 'C': 0.6, 'D': 0.4, 'E': 0.2 };
  const mult = multipliers[scalingGrade] || 0;
  let saturation = statValue <= 40 ? ((statValue - 10) / 30) * 0.85 : 0.85 + ((statValue - 40) / 59) * 0.15;
  return baseDamage * mult * Math.max(0, saturation);
};

export const getChaosMultiplier = (humanity: number): number => {
  const humBonus = [0, 0.08, 0.11, 0.14, 0.17, 0.19, 0.21, 0.23, 0.25, 0.27, 0.29];
  return 1.0 + (humanity > 10 ? 0.29 : humBonus[humanity]);
};

export const calculateTotalAR = (weapon: any, str: number, dex: number, humanity: number) => {
  if (!weapon || weapon.id === 'none') return { phys: 0, mag: 0, fire: 0, light: 0, total: 0 };
  
  let phys = weapon.basePhys;
  phys += calculateScalingBonus(weapon.basePhys, str, weapon.strScal);
  phys += calculateScalingBonus(weapon.basePhys, dex, weapon.dexScal);

  let fire = weapon.baseFire;
  if (weapon.isChaos) {
    const chaosMult = getChaosMultiplier(humanity);
    phys *= chaosMult;
    fire *= chaosMult;
  }

  return {
    phys: Math.round(phys),
    mag: Math.round(weapon.baseMag),
    fire: Math.round(fire),
    light: Math.round(weapon.baseLight),
    total: Math.round(phys + weapon.baseMag + fire + weapon.baseLight)
  };
};

export const calculateMaxEquipLoad = (endurance: number, ring1Id: string, ring2Id: string): number => {
  let baseLoad = 40.0 + endurance; 
  let multiplier = 1.0;
  if (ring1Id === 'havel' || ring2Id === 'havel') multiplier += 0.5;
  if (ring1Id === 'fap' || ring2Id === 'fap') multiplier += 0.2;
  return baseLoad * multiplier;
};

export const calculateHP = (vitality: number, ring1Id: string, ring2Id: string): number => {
  let baseHp = 0;
  if (vitality <= 10) baseHp = 400 + (vitality * 17);
  else if (vitality <= 30) baseHp = 573 + ((vitality - 10) * 26);
  else if (vitality <= 50) baseHp = 1100 + ((vitality - 30) * 20);
  else baseHp = 1500 + ((vitality - 50) * 8);

  let multiplier = 1.0;
  if (ring1Id === 'fap' || ring2Id === 'fap') multiplier += 0.2;
  if (ring1Id === 'tiny_being' || ring2Id === 'tiny_being') multiplier += 0.05;
  return Math.round(baseHp * multiplier);
};

export const calculateStamina = (endurance: number, ring1Id: string, ring2Id: string): number => {
  let baseStamina = endurance <= 40 ? 80 + (endurance * 2) : 160;
  let multiplier = 1.0;
  if (ring1Id === 'fap' || ring2Id === 'fap') multiplier += 0.2;
  return Math.round(baseStamina * multiplier);
};

export const calculateSoulLevel = (stats: any): number => {
  return stats.vit + stats.att + stats.end + stats.str + stats.dex + stats.res + stats.int + stats.fth - 83;
};

export const calculateAttunementSlots = (att: number): number => {
  if (att < 10) return 0;
  if (att < 12) return 1;
  if (att < 14) return 2;
  if (att < 16) return 3;
  if (att < 19) return 4;
  if (att < 23) return 5;
  if (att < 28) return 6;
  if (att < 34) return 7;
  if (att < 41) return 8;
  if (att < 50) return 9;
  return 10;
};

export const calculateItemDiscovery = (humanity: number, ring1: string, ring2: string): number => {
  let base = 100;
  const humBonus = [0, 50, 58, 65, 73, 80, 86, 92, 98, 104, 110];
  base += (humanity > 10 ? 110 : humBonus[humanity] || 0);
  if (ring1 === 'cgsr' || ring2 === 'cgsr') {
    base += 200;
  }
  return Math.min(base, 410);
};

export const calculatePoise = (armorParams: any[], ring1: string, ring2: string): number => {
  let poise = armorParams.reduce((acc, val) => acc + (val?.poise || 0), 0);
  if (ring1 === 'wolf' || ring2 === 'wolf') poise += 40;
  return poise;
};

export const calculateDefenses = (armorParams: any[], ring1: string, ring2: string) => {
  let phys = armorParams.reduce((acc, val) => acc + (val?.physDef || 0), 0);
  let mag = armorParams.reduce((acc, val) => acc + (val?.magDef || 0), 0);
  let fire = armorParams.reduce((acc, val) => acc + (val?.fireDef || 0), 0);
  let light = armorParams.reduce((acc, val) => acc + (val?.lightDef || 0), 0);
  let bleed = armorParams.reduce((acc, val) => acc + (val?.bleedRes || 0), 0);
  let poison = armorParams.reduce((acc, val) => acc + (val?.poisonRes || 0), 0);
  let curse = armorParams.reduce((acc, val) => acc + (val?.curseRes || 0), 0);

  if (ring1 === 'steel_protection' || ring2 === 'steel_protection') phys += 50;

  // In DS1, level also adds base defense, but we will simplify to just armor + rings + base 50
  return {
    phys: phys + 50,
    mag: mag + 50,
    fire: fire + 50,
    light: light + 50,
    bleed: bleed + 50,
    poison: poison + 50,
    curse: curse + 30
  };
};
