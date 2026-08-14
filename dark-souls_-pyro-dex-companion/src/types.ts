export type TaskCategory = 'pyromancy' | 'weapon' | 'boss' | 'npc' | 'item' | 'shortcut' | 'stat' | 'exploration' | 'quest';
export type TaskPriority = 'essential' | 'recommended' | 'optional';

export interface RoadguideTask {
  id: string;
  stageId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  location: string;
  pyroTip?: string;
  dexTip?: string;
  completed: boolean;
}

export interface GuideSection {
  id: string;
  title: string;
  icon?: string;
  badge?: string;
  items: string[];
  tips?: string[];
  warning?: string;
}

export interface RoadguideStage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  zone: string;
  recommendedDex: string;
  recommendedPyroFlame: string;
  summary: string;
  keyRewards: string[];
  tasks: RoadguideTask[];
  levelRange?: string;
  buildStatus?: {
    startLevel: string;
    endLevel: string;
    weapons: string;
    focusStat: string;
    defense: string;
  };
  guideSections?: GuideSection[];
  combatTactics?: Array<{ name: string; description: string; tag?: string }>;
}

export interface BossData {
  id: string;
  name: string;
  portugueseName: string;
  location: string;
  souls: number;
  deaths: number;
  defeated: boolean;
  weakness: string[];
  resistances: string[];
  pyroStrategy: string;
  dexStrategy: string;
  drops: string[];
  userNotes: string;
  isOptional?: boolean;
  isDlc?: boolean;
}

export interface QuickNote {
  id: string;
  text: string;
  createdAt: number;
  category: 'build' | 'farming' | 'boss' | 'npc' | 'general';
  pinned: boolean;
}

export interface SteamAchievementData {
  apiname: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockTime?: number;
  category: 'pyromancy' | 'boss' | 'weapon' | 'covenant' | 'ending' | 'general';
  relatedType?: 'pyromancy' | 'miracle' | 'sorcery' | 'weapon' | 'ember' | 'boss' | 'covenant' | 'ending' | 'stage';
  relatedTargetTab?: 'roadguide' | 'bosses' | 'platinum' | 'notes';
  relatedCategoryFilter?: string;
  relatedBossId?: string;
  relatedStageNumber?: number;
  relationshipLabel?: string;
  relationshipTip?: string;
}

export interface SteamProfileState {
  steamId: string;
  personaname: string;
  avatar: string;
  profileUrl: string;
  personaState: number; // 0 = Offline, 1 = Online, etc.
  gameTitle?: string;
  isPlayingDS1: boolean;
  lastSyncedAt?: number;
  isSimulated: boolean;
}

export type CompanionType = 'bonfire' | 'solaire' | 'firekeeper' | 'estus' | 'artorias';

export interface OverlaySettings {
  opacity: number; // 0.2 to 1.0
  backdropBlur: boolean;
  overlayMode: boolean; // Compact gaming overlay vs standard full window
  nightMode: boolean; // Extra dark ash theme
  theme: 'pyromancer' | 'sorcerer' | 'cleric' | 'abyssal' | 'hollow';
  fontFamily: 'classic' | 'clean' | 'soft' | 'cartoon';
  language: 'pt' | 'en';
  companionType: CompanionType;
  soundEnabled: boolean;
  pinnedToCorner: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showPetOnScreen: boolean;
  showQuickSettings: boolean;
}
