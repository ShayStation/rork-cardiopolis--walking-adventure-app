// Utility functions

import { GAME_CONFIG } from '@/constants/game-config';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getXPNeeded(level: number): number {
  return GAME_CONFIG.XP_TO_LEVEL_UP_BASE * level;
}

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpNeeded = getXPNeeded(level);
  let accumulatedXP = 0;
  
  while (accumulatedXP + xpNeeded <= totalXP && level < GAME_CONFIG.MAX_COMPANION_LEVEL) {
    accumulatedXP += xpNeeded;
    level++;
    xpNeeded = getXPNeeded(level);
  }
  
  return level;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const level = calculateLevel(totalXP);
  let accumulatedXP = 0;
  
  for (let i = 1; i < level; i++) {
    accumulatedXP += getXPNeeded(i);
  }
  
  const currentLevelXP = totalXP - accumulatedXP;
  const neededForNext = getXPNeeded(level);
  
  return {
    current: currentLevelXP,
    needed: neededForNext,
    percentage: (currentLevelXP / neededForNext) * 100
  };
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}