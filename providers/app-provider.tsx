import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  AppStats, 
  Companion, 
  WorkoutSession, 
  Settings, 
  Discovery,
  Challenge,
  Badge,
  VillageUpgrade,
  HotspotType
} from '@/types/models';
import { 
  GAME_CONFIG, 
  COMPANION_NAMES, 
  COMPANION_TYPES,
  BIOMES,
  BADGES_CONFIG
} from '@/constants/game-config';
import { generateId, getRandomElement, shuffleArray } from '@/utils/helpers';
import healthService from '@/utils/health-service';

interface AppState {
  stats: AppStats;
  companions: Companion[];
  currentWorkout: WorkoutSession | null;
  settings: Settings;
  discoveries: Discovery[];
  challenges: Challenge[];
  badges: Badge[];
  villageUpgrades: VillageUpgrade[];
  currentBiomeId: string;
  biomeResources: Record<string, number>;
}

const STORAGE_KEY = 'cardiopolis_state';

const initialState: AppState = {
  stats: {
    totalSteps: 0,
    workoutSteps: 0,
    totalWorkouts: 0,
    totalSeeds: 0,
    totalDiscoveries: 0,
    dailyDiscoveryCount: 0
  },
  companions: [],
  currentWorkout: null,
  settings: {
    debugMode: true,
    stepSource: 'debug',
    activeHotspots: [],
    soundEnabled: true
  },
  discoveries: [],
  challenges: [],
  badges: BADGES_CONFIG.map(b => ({ ...b, unlocked: false })),
  villageUpgrades: [],
  currentBiomeId: 'grass',
  biomeResources: {
    grass: 0,
    wetland: 0,
    desert: 0,
    winter: 0
  }
};

function generateInitialCompanions(): Companion[] {
  const names = shuffleArray([...COMPANION_NAMES]).slice(0, 6);
  return names.map((name, index) => ({
    id: generateId(),
    name,
    typeId: COMPANION_TYPES[index % COMPANION_TYPES.length].id,
    level: 1,
    totalXP: 0,
    sessionXP: 0,
    isSelected: index === 0
  }));
}

function generateDailyChallenges(): Challenge[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + (7 - now.getDay()));
  nextWeek.setHours(0, 0, 0, 0);
  
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return [
    {
      id: 'daily_steps',
      name: 'Daily Walker',
      description: 'Walk 5,000 steps today',
      period: 'daily',
      goalType: 'steps',
      goal: 5000,
      progress: 0,
      completed: false,
      expiresAt: tomorrow.toISOString()
    },
    {
      id: 'weekly_workouts',
      name: 'Weekly Warrior',
      description: 'Complete 5 workouts this week',
      period: 'weekly',
      goalType: 'workouts',
      goal: 5,
      progress: 0,
      completed: false,
      expiresAt: nextWeek.toISOString()
    },
    {
      id: 'monthly_steps',
      name: 'Monthly Marathon',
      description: 'Walk 150,000 steps this month',
      period: 'monthly',
      goalType: 'steps',
      goal: 150000,
      progress: 0,
      completed: false,
      expiresAt: nextMonth.toISOString()
    }
  ];
}

export const [AppProvider, useApp] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [healthPermissionGranted, setHealthPermissionGranted] = useState(false);
  const [healthTrackingCleanup, setHealthTrackingCleanup] = useState<(() => void) | null>(null);
  const [lastHealthSync, setLastHealthSync] = useState<Date | null>(null);
  const lastKnownHealthStepsRef = useRef(0);
  
  // Load persisted state
  const { data: persistedState } = useQuery({
    queryKey: ['app-state'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        // Ensure companions exist
        if (!parsed.companions || parsed.companions.length === 0) {
          parsed.companions = generateInitialCompanions();
        }
        // Ensure challenges exist
        if (!parsed.challenges || parsed.challenges.length === 0) {
          parsed.challenges = generateDailyChallenges();
        }
        return parsed;
      }
      return {
        ...initialState,
        companions: generateInitialCompanions(),
        challenges: generateDailyChallenges()
      };
    }
  });
  
  const [state, setState] = useState<AppState>(persistedState || initialState);
  
  useEffect(() => {
    if (persistedState && !isInitialized) {
      setState(persistedState);
      setIsInitialized(true);
    }
  }, [persistedState, isInitialized]);
  

  
  // Save state mutation
  const saveMutation = useMutation({
    mutationFn: async (newState: AppState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-state'] });
    }
  });
  
  // Auto-save on state changes
  useEffect(() => {
    if (isInitialized) {
      saveMutation.mutate(state);
    }
  }, [state, isInitialized]);
  

  
  // Internal step addition (used by both manual and health sync)
  const addStepsInternal = useCallback((steps: number) => {
    setState(prev => {
      const newState = { ...prev };
      newState.stats.totalSteps += steps;
      
      if (newState.currentWorkout) {
        newState.stats.workoutSteps += steps;
        
        // Calculate seeds (only during workout)
        const newSeeds = Math.floor(steps / GAME_CONFIG.SEEDS_PER_STEPS);
        newState.currentWorkout.seeds += newSeeds;
        newState.stats.totalSeeds += newSeeds;
        
        // Calculate XP with workout bonus
        const baseXP = Math.floor(steps / GAME_CONFIG.XP_PER_STEPS);
        const bonusXP = Math.floor(baseXP * GAME_CONFIG.WORKOUT_XP_MULTIPLIER);
        newState.currentWorkout.sessionXP += bonusXP;
        
        // Apply XP to selected companion
        const selectedCompanion = newState.companions.find(c => c.isSelected);
        if (selectedCompanion) {
          const companion = newState.companions.find(c => c.id === selectedCompanion.id);
          if (companion) {
            companion.sessionXP += bonusXP;
            companion.totalXP += bonusXP;
          }
        }
      } else {
        // Calculate XP without workout bonus
        const baseXP = Math.floor(steps / GAME_CONFIG.XP_PER_STEPS);
        const selectedCompanion = newState.companions.find(c => c.isSelected);
        if (selectedCompanion) {
          const companion = newState.companions.find(c => c.id === selectedCompanion.id);
          if (companion) {
            companion.totalXP += baseXP;
          }
        }
      }
      
      // Update challenges
      newState.challenges = newState.challenges.map(challenge => {
        if (challenge.goalType === 'steps' && !challenge.completed) {
          const newProgress = challenge.progress + steps;
          return {
            ...challenge,
            progress: Math.min(newProgress, challenge.goal),
            completed: newProgress >= challenge.goal
          };
        }
        return challenge;
      });
      
      // Check badge unlocks
      newState.badges = newState.badges.map(badge => {
        if (!badge.unlocked && badge.unlockRule.type === 'steps') {
          if (newState.stats.totalSteps >= badge.unlockRule.threshold) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          }
        }
        return badge;
      });
      
      return newState;
    });
  }, []);
  
  // Public step management (for debug mode)
  const addSteps = useCallback((steps: number) => {
    if (state.settings.stepSource === 'debug') {
      addStepsInternal(steps);
    } else {
      console.log('Manual step addition disabled in health mode');
    }
  }, [state.settings.stepSource, addStepsInternal]);
  
  // Workout management
  const startWorkout = useCallback((companionId?: string) => {
    setState(prev => ({
      ...prev,
      currentWorkout: {
        id: generateId(),
        startAt: new Date().toISOString(),
        steps: 0,
        seeds: 0,
        sessionXP: 0,
        companionId
      },
      stats: {
        ...prev.stats,
        workoutSteps: 0
      },
      companions: prev.companions.map(c => ({
        ...c,
        sessionXP: 0
      }))
    }));
  }, []);
  
  const endWorkout = useCallback(() => {
    setState(prev => {
      if (!prev.currentWorkout) return prev;
      
      const newState = { ...prev };
      if (newState.currentWorkout) {
        newState.currentWorkout.endAt = new Date().toISOString();
      }
      newState.stats.totalWorkouts += 1;
      newState.stats.workoutSteps = 0;
      
      // Update workout challenges
      newState.challenges = newState.challenges.map(challenge => {
        if (challenge.goalType === 'workouts' && !challenge.completed) {
          const newProgress = challenge.progress + 1;
          return {
            ...challenge,
            progress: Math.min(newProgress, challenge.goal),
            completed: newProgress >= challenge.goal
          };
        }
        return challenge;
      });
      
      // Check workout badges
      newState.badges = newState.badges.map(badge => {
        if (!badge.unlocked) {
          if (badge.unlockRule.type === 'workouts' && newState.stats.totalWorkouts >= badge.unlockRule.threshold) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          }
          if (badge.unlockRule.type === 'seeds' && newState.stats.totalSeeds >= badge.unlockRule.threshold) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          }
        }
        return badge;
      });
      
      // Clear current workout
      newState.currentWorkout = null;
      
      return newState;
    });
  }, []);
  
  // Companion management
  const selectCompanion = useCallback((companionId: string) => {
    setState(prev => ({
      ...prev,
      companions: prev.companions.map(c => ({
        ...c,
        isSelected: c.id === companionId
      }))
    }));
  }, []);
  
  const resetSelectedCompanionLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      companions: prev.companions.map(c => 
        c.isSelected ? { ...c, level: 1, totalXP: 0, sessionXP: 0 } : c
      )
    }));
  }, []);
  
  const regenerateCompanions = useCallback(() => {
    setState(prev => ({
      ...prev,
      companions: generateInitialCompanions()
    }));
  }, []);
  
  // Biome management
  const setBiome = useCallback((biomeId: string) => {
    setState(prev => ({
      ...prev,
      currentBiomeId: biomeId
    }));
  }, []);
  
  const addBiomeResource = useCallback((biomeId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      biomeResources: {
        ...prev.biomeResources,
        [biomeId]: (prev.biomeResources[biomeId] || 0) + amount
      }
    }));
  }, []);
  
  // Discovery management
  const addDiscovery = useCallback((hotspotType: HotspotType) => {
    const today = new Date().toDateString();
    const todayDiscoveries = state.discoveries.filter(d => 
      new Date(d.at).toDateString() === today
    ).length;
    
    if (todayDiscoveries >= GAME_CONFIG.DAILY_DISCOVERY_CAP) {
      console.log('Daily discovery cap reached');
      return false;
    }
    
    setState(prev => {
      const newDiscovery: Discovery = {
        id: generateId(),
        biomeId: prev.currentBiomeId,
        hotspotType,
        at: new Date().toISOString(),
        villagerName: getRandomElement(['Farmer Joe', 'Merchant Mary', 'Guard Tom', 'Baker Sue'])
      };
      
      const newState = {
        ...prev,
        discoveries: [...prev.discoveries, newDiscovery],
        stats: {
          ...prev.stats,
          totalDiscoveries: prev.stats.totalDiscoveries + 1
        }
      };
      
      // Check discovery badges
      newState.badges = newState.badges.map(badge => {
        if (!badge.unlocked && badge.unlockRule.type === 'discoveries') {
          if (newState.stats.totalDiscoveries >= badge.unlockRule.threshold) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          }
        }
        return badge;
      });
      
      return newState;
    });
    
    return true;
  }, [state.discoveries]);
  
  // Settings management
  const toggleDebugMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        debugMode: !prev.settings.debugMode
      }
    }));
  }, []);
  
  const setStepSource = useCallback((source: 'debug' | 'health') => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        stepSource: source
      }
    }));
  }, []);
  
  const toggleHotspot = useCallback((hotspot: HotspotType) => {
    setState(prev => {
      const activeHotspots = prev.settings.activeHotspots.includes(hotspot)
        ? prev.settings.activeHotspots.filter(h => h !== hotspot)
        : [...prev.settings.activeHotspots, hotspot];
      
      return {
        ...prev,
        settings: {
          ...prev.settings,
          activeHotspots
        }
      };
    });
  }, []);
  
  const resetAllData = useCallback(async () => {
    const freshState = {
      ...initialState,
      companions: generateInitialCompanions(),
      challenges: generateDailyChallenges()
    };
    setState(freshState);
    await AsyncStorage.removeItem(STORAGE_KEY);
    queryClient.invalidateQueries({ queryKey: ['app-state'] });
  }, [queryClient]);
  
  const resetSeeds = useCallback(() => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalSeeds: 0
      }
    }));
  }, []);
  
  // Health service integration
  const syncHealthSteps = useCallback(async () => {
    try {
      console.log('Syncing steps from health app...');
      const healthSteps = await healthService.getTodaySteps();
      
      // Get current app steps to compare
      setState(prev => {
        if (healthSteps > prev.stats.totalSteps) {
          const newSteps = healthSteps - prev.stats.totalSteps;
          console.log(`Setting total steps to ${healthSteps} (adding ${newSteps})`);
          lastKnownHealthStepsRef.current = healthSteps;
          
          // Update state directly instead of using addStepsInternal to avoid double processing
          const newState = { ...prev };
          newState.stats.totalSteps = healthSteps;
          
          // Update challenges for the new steps
          newState.challenges = newState.challenges.map(challenge => {
            if (challenge.goalType === 'steps' && !challenge.completed) {
              const newProgress = challenge.progress + newSteps;
              return {
                ...challenge,
                progress: Math.min(newProgress, challenge.goal),
                completed: newProgress >= challenge.goal
              };
            }
            return challenge;
          });
          
          // Check badge unlocks
          newState.badges = newState.badges.map(badge => {
            if (!badge.unlocked && badge.unlockRule.type === 'steps') {
              if (newState.stats.totalSteps >= badge.unlockRule.threshold) {
                return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
              }
            }
            return badge;
          });
          
          return newState;
        } else {
          lastKnownHealthStepsRef.current = Math.max(lastKnownHealthStepsRef.current, healthSteps);
          return prev;
        }
      });
      
      setLastHealthSync(new Date());
    } catch (error) {
      console.log('Error syncing health steps:', error);
    }
  }, []);
  
  const stopHealthTracking = useCallback(() => {
    if (healthTrackingCleanup) {
      healthTrackingCleanup();
      setHealthTrackingCleanup(null);
    }
  }, [healthTrackingCleanup]);
  
  const startHealthTracking = useCallback(() => {
    if (healthTrackingCleanup) {
      healthTrackingCleanup();
    }
    
    const cleanup = healthService.startStepTracking((totalHealthSteps) => {
      console.log('Health tracking update:', totalHealthSteps);
      
      // Only update if health steps are higher than our last known count
      if (totalHealthSteps > lastKnownHealthStepsRef.current) {
        const newSteps = totalHealthSteps - lastKnownHealthStepsRef.current;
        console.log(`Adding ${newSteps} steps from health tracking`);
        lastKnownHealthStepsRef.current = totalHealthSteps;
        addStepsInternal(newSteps);
      }
    });
    
    setHealthTrackingCleanup(() => cleanup);
  }, [healthTrackingCleanup, addStepsInternal]);
  
  const initializeHealthService = useCallback(async () => {
    if (state.settings.stepSource === 'health') {
      console.log('Initializing health service...');
      const isAvailable = await healthService.isAvailable();
      if (isAvailable) {
        const hasPermission = await healthService.requestPermissions();
        setHealthPermissionGranted(hasPermission);
        
        if (hasPermission) {
          // Initialize the ref with current total steps to avoid double counting
          lastKnownHealthStepsRef.current = state.stats.totalSteps;
          
          // Sync existing steps from health app
          await syncHealthSteps();
          
          // Start tracking new steps
          startHealthTracking();
        }
      } else {
        console.log('Health service not available, falling back to debug mode');
        setState(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            stepSource: 'debug'
          }
        }));
      }
    }
  }, [state.settings.stepSource, state.stats.totalSteps, syncHealthSteps, startHealthTracking]);
  
  // Initialize health service when app starts if health mode is enabled
  useEffect(() => {
    if (isInitialized && state.settings.stepSource === 'health') {
      initializeHealthService();
    }
    
    // Cleanup on unmount
    return () => {
      stopHealthTracking();
    };
  }, [isInitialized, state.settings.stepSource, initializeHealthService, stopHealthTracking]);
  
  // Handle step source changes
  useEffect(() => {
    if (isInitialized) {
      if (state.settings.stepSource === 'health') {
        initializeHealthService();
      } else {
        stopHealthTracking();
      }
    }
  }, [isInitialized, state.settings.stepSource, initializeHealthService, stopHealthTracking]);
  
  // Computed values
  const selectedCompanion = useMemo(() => 
    state.companions.find(c => c.isSelected),
    [state.companions]
  );
  
  const currentBiome = useMemo(() => 
    BIOMES.find(b => b.id === state.currentBiomeId) || BIOMES[0],
    [state.currentBiomeId]
  );
  
  const workoutDuration = useMemo(() => {
    if (!state.currentWorkout) return 0;
    const start = new Date(state.currentWorkout.startAt).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 1000);
  }, [state.currentWorkout]);
  
  return {
    // State
    stats: state.stats,
    companions: state.companions,
    currentWorkout: state.currentWorkout,
    settings: state.settings,
    discoveries: state.discoveries,
    challenges: state.challenges,
    badges: state.badges,
    villageUpgrades: state.villageUpgrades,
    biomeResources: state.biomeResources,
    
    // Computed
    selectedCompanion,
    currentBiome,
    workoutDuration,
    isLoading: !isInitialized,
    
    // Actions
    addSteps,
    syncHealthSteps,
    startWorkout,
    endWorkout,
    selectCompanion,
    resetSelectedCompanionLevel,
    regenerateCompanions,
    setBiome,
    addBiomeResource,
    addDiscovery,
    toggleDebugMode,
    setStepSource,
    toggleHotspot,
    resetAllData,
    resetSeeds
  };
});