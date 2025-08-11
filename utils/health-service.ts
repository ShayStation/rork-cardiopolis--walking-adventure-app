import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

export interface HealthData {
  steps: number;
  date: string;
}

export interface HealthService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySteps(): Promise<number>;
  getStepsSince(date: Date): Promise<number>;
  getHistoricalSteps(startDate: Date, endDate: Date): Promise<HealthData[]>;
  startStepTracking(callback: (steps: number) => void): () => void;
}

class ExpoHealthService implements HealthService {
  private stepSubscription: any = null;
  private lastKnownSteps = 0;
  private trackingStartTime: Date | null = null;

  async isAvailable(): Promise<boolean> {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('Pedometer availability:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.log('Error checking pedometer availability:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        console.log('Pedometer not available on this device');
        return false;
      }
      
      // For Expo Pedometer, permissions are handled automatically
      // We just need to test if we can get step data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await Pedometer.getStepCountAsync(today, new Date());
      console.log('Pedometer permissions granted');
      return true;
    } catch (error) {
      console.log('Error requesting pedometer permissions:', error);
      return false;
    }
  }

  async getTodaySteps(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const result = await Pedometer.getStepCountAsync(today, new Date());
      console.log('Today\'s steps from health:', result.steps);
      return result.steps;
    } catch (error) {
      console.log('Error getting today\'s steps:', error);
      return 0;
    }
  }

  async getStepsSince(date: Date): Promise<number> {
    try {
      const result = await Pedometer.getStepCountAsync(date, new Date());
      console.log(`Steps since ${date.toISOString()}:`, result.steps);
      return result.steps;
    } catch (error) {
      console.log('Error getting steps since date:', error);
      return 0;
    }
  }

  async getHistoricalSteps(startDate: Date, endDate: Date): Promise<HealthData[]> {
    try {
      // Expo Pedometer doesn't support day-by-day historical data
      // We can only get total steps for a range
      const result = await Pedometer.getStepCountAsync(startDate, endDate);
      
      return [{
        steps: result.steps,
        date: endDate.toISOString()
      }];
    } catch (error) {
      console.log('Error getting historical steps:', error);
      return [];
    }
  }

  startStepTracking(callback: (steps: number) => void): () => void {
    console.log('Starting step tracking...');
    this.trackingStartTime = new Date();
    
    // Get initial step count
    this.getTodaySteps().then(steps => {
      this.lastKnownSteps = steps;
      callback(steps);
    });

    // Set up periodic checking (every 30 seconds)
    const interval = setInterval(async () => {
      try {
        const currentSteps = await this.getTodaySteps();
        if (currentSteps !== this.lastKnownSteps) {
          console.log(`Step update: ${this.lastKnownSteps} -> ${currentSteps}`);
          this.lastKnownSteps = currentSteps;
          callback(currentSteps);
        }
      } catch (error) {
        console.log('Error in step tracking interval:', error);
      }
    }, 30000); // Check every 30 seconds

    // Return cleanup function
    return () => {
      console.log('Stopping step tracking...');
      clearInterval(interval);
      this.trackingStartTime = null;
    };
  }
}

// Mock health service for development/testing
class MockHealthService implements HealthService {
  private mockSteps = 0;
  private trackingCallback: ((steps: number) => void) | null = null;
  private trackingInterval: any = null;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async getTodaySteps(): Promise<number> {
    // Simulate realistic step count that increases over time
    const now = new Date();
    const minutesSinceMidnight = (now.getHours() * 60) + now.getMinutes();
    const baseSteps = Math.floor(minutesSinceMidnight * 8.5); // ~8.5 steps per minute average
    const randomVariation = Math.floor(Math.random() * 1000);
    
    this.mockSteps = Math.max(this.mockSteps, baseSteps + randomVariation);
    return this.mockSteps;
  }

  async getStepsSince(date: Date): Promise<number> {
    return this.getTodaySteps();
  }

  async getHistoricalSteps(startDate: Date, endDate: Date): Promise<HealthData[]> {
    const steps = await this.getTodaySteps();
    return [{
      steps,
      date: endDate.toISOString()
    }];
  }

  startStepTracking(callback: (steps: number) => void): () => void {
    console.log('Starting mock step tracking...');
    this.trackingCallback = callback;
    
    // Initial callback
    this.getTodaySteps().then(callback);
    
    // Simulate step updates every 10 seconds
    this.trackingInterval = setInterval(async () => {
      this.mockSteps += Math.floor(Math.random() * 20) + 5; // Add 5-25 steps
      callback(this.mockSteps);
    }, 10000);

    return () => {
      console.log('Stopping mock step tracking...');
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
      }
      this.trackingCallback = null;
    };
  }
}

// Create the appropriate service based on platform and availability
let healthService: HealthService;

if (Platform.OS === 'web') {
  // Use mock service for web
  healthService = new MockHealthService();
} else {
  // Use real service for mobile
  healthService = new ExpoHealthService();
}

export { healthService };
export default healthService;