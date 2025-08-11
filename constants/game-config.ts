// Game configuration and constants

import { CompanionType, Biome, Badge } from '@/types/models';

export const GAME_CONFIG = {
  // Step conversion rates
  SEEDS_PER_STEPS: 500, // 1 seed per 500 steps
  XP_PER_STEPS: 50, // 1 XP per 50 steps
  WORKOUT_XP_MULTIPLIER: 1.25, // 25% bonus during workouts
  
  // Companion leveling
  XP_TO_LEVEL_UP_BASE: 100,
  MAX_COMPANION_LEVEL: 50,
  
  // Discovery system
  DAILY_DISCOVERY_CAP: 3,
  BASE_DISCOVERY_CHANCE: 0.05, // 5% base chance
  HOTSPOT_MULTIPLIER: 3, // Triple chance at hotspots
  
  // Workout settings
  MIN_WORKOUT_DURATION: 60, // seconds
  
  // Village
  INITIAL_SEEDS: 0,
  INITIAL_RESOURCES: 0,
} as const;

export const COMPANION_NAMES = [
  'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper',
  'Daisy', 'Rocky', 'Sadie', 'Duke', 'Molly', 'Bear',
  'Sophie', 'Jack', 'Chloe', 'Toby', 'Lily', 'Zeus',
  'Oliver', 'Ruby', 'Bentley', 'Zoe', 'Leo', 'Mia',
  'Louie', 'Penny', 'Finn', 'Rosie', 'Dexter', 'Roxy',
  'Oscar', 'Nala', 'Winston', 'Coco', 'Milo', 'Gracie',
  'Simba', 'Piper', 'Gus', 'Ellie'
];

export const COMPANION_TYPES: CompanionType[] = [
  {
    id: 'hunter',
    name: 'Hunter',
    baseStats: { speed: 8, stamina: 6, luck: 4 },
    role: 'Scout',
    description: 'Swift and alert, Hunters excel at discovering new areas'
  },
  {
    id: 'gatherer',
    name: 'Gatherer',
    baseStats: { speed: 5, stamina: 7, luck: 6 },
    role: 'Collector',
    description: 'Patient and thorough, Gatherers find more seeds'
  },
  {
    id: 'farmer',
    name: 'Farmer',
    baseStats: { speed: 4, stamina: 9, luck: 5 },
    role: 'Builder',
    description: 'Strong and steady, Farmers boost village growth'
  }
];

export const BIOMES: Biome[] = [
  {
    id: 'grass',
    name: 'Grasslands',
    uniqueResourceName: 'Wildflowers',
    themeKey: 'grass',
    backgroundColor: '#E8F5E9',
    accentColor: '#4CAF50'
  },
  {
    id: 'wetland',
    name: 'Wetlands',
    uniqueResourceName: 'Lotus Blooms',
    themeKey: 'wetland',
    backgroundColor: '#E1F5FE',
    accentColor: '#03A9F4'
  },
  {
    id: 'desert',
    name: 'Dry Desert',
    uniqueResourceName: 'Cacti Flowers',
    themeKey: 'desert',
    backgroundColor: '#FFF3E0',
    accentColor: '#FF9800'
  },
  {
    id: 'winter',
    name: 'Winter Tundra',
    uniqueResourceName: 'Ice Crystals',
    themeKey: 'winter',
    backgroundColor: '#F3E5F5',
    accentColor: '#9C27B0'
  }
];

export const BADGES_CONFIG: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Walk your first 1,000 steps',
    icon: '👟',
    unlockRule: { type: 'steps', threshold: 1000 }
  },
  {
    id: 'walker',
    name: 'Walker',
    description: 'Walk 10,000 steps',
    icon: '🚶',
    unlockRule: { type: 'steps', threshold: 10000 }
  },
  {
    id: 'marathoner',
    name: 'Marathoner',
    description: 'Walk 100,000 steps',
    icon: '🏃',
    unlockRule: { type: 'steps', threshold: 100000 }
  },
  {
    id: 'workout_warrior',
    name: 'Workout Warrior',
    description: 'Complete 10 workouts',
    icon: '💪',
    unlockRule: { type: 'workouts', threshold: 10 }
  },
  {
    id: 'seed_collector',
    name: 'Seed Collector',
    description: 'Collect 100 seeds',
    icon: '🌱',
    unlockRule: { type: 'seeds', threshold: 100 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Make 20 discoveries',
    icon: '🗺️',
    unlockRule: { type: 'discoveries', threshold: 20 }
  }
];