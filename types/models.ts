// Core data models for Cardiopolis

export interface CompanionType {
  id: string;
  name: string;
  baseStats: {
    speed: number;
    stamina: number;
    luck: number;
  };
  role: string;
  description: string;
}

export interface Companion {
  id: string;
  name: string;
  typeId: string;
  level: number;
  totalXP: number;
  sessionXP: number;
  portraitUri?: string;
  isSelected: boolean;
}

export interface Biome {
  id: string;
  name: string;
  uniqueResourceName: string;
  themeKey: string;
  backgroundColor: string;
  accentColor: string;
}

export type ChallengePeriod = 'daily' | 'weekly' | 'monthly';
export type ChallengeGoalType = 'steps' | 'workouts' | 'discoveries';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  period: ChallengePeriod;
  goalType: ChallengeGoalType;
  goal: number;
  progress: number;
  completed: boolean;
  expiresAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  unlockRule: {
    type: 'steps' | 'workouts' | 'discoveries' | 'seeds';
    threshold: number;
  };
}

export interface WorkoutSession {
  id: string;
  startAt: string;
  endAt?: string;
  steps: number;
  seeds: number;
  sessionXP: number;
  companionId?: string;
}

export type HotspotType = 'park' | 'stadium' | 'theater';

export interface Discovery {
  id: string;
  biomeId: string;
  hotspotType: HotspotType;
  at: string;
  villagerName?: string;
}

export interface VillageUpgrade {
  id: string;
  name: string;
  description: string;
  seedCost: number;
  resourceCost: number;
  biomeId: string;
  purchased: boolean;
}

export interface Settings {
  debugMode: boolean;
  stepSource: 'debug' | 'health';
  activeHotspots: HotspotType[];
  soundEnabled: boolean;
}

export interface AppStats {
  totalSteps: number;
  workoutSteps: number;
  totalWorkouts: number;
  totalSeeds: number;
  totalDiscoveries: number;
  lastWorkoutDate?: string;
  dailyDiscoveryCount: number;
  dailyDiscoveryDate?: string;
}