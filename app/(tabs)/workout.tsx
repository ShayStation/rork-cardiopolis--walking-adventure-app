import React from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart3 } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { formatNumber, formatDuration, getXPProgress } from '@/utils/helpers';

export default function WorkoutScreen() {
  const router = useRouter();
  const {
    stats,
    currentWorkout,
    selectedCompanion,
    settings,
    workoutDuration,
    addSteps,
    startWorkout,
    syncHealthSteps
  } = useApp();
  
  const handleStartWorkout = () => {
    if (!selectedCompanion) {
      router.push('/companion-select');
    } else {
      startWorkout(selectedCompanion.id);
    }
  };
  
  const handleEndWorkout = () => {
    if (currentWorkout) {
      router.push('/workout-summary');
    }
  };
  
  const handleCheckSteps = async () => {
    if (settings.stepSource === 'health') {
      console.log('Syncing steps from health app...');
      await syncHealthSteps();
      Alert.alert('Health Sync', 'Steps synced from your health app!');
    } else {
      console.log('Checking steps from source:', settings.stepSource);
      Alert.alert('Step Check', `Current source: ${settings.stepSource}\nThis would poll for new steps.`);
    }
  };
  
  if (!currentWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Ready to Start?</Text>
          <Text style={styles.subtitle}>
            {selectedCompanion 
              ? `Your companion ${selectedCompanion.name} is ready!`
              : 'Select a companion to begin your workout'}
          </Text>
          <Button
            title={selectedCompanion ? "Start Workout" : "Select Companion"}
            onPress={handleStartWorkout}
            variant="success"
            size="large"
            style={styles.startButton}
          />
        </View>
      </View>
    );
  }
  
  const xpProgress = selectedCompanion ? getXPProgress(selectedCompanion.totalXP + selectedCompanion.sessionXP) : null;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Workout Statistics Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <BarChart3 size={24} color="#4CAF50" />
          <Text style={styles.statsTitle}>Workout Statistics</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{formatNumber(stats.totalSteps)}</Text>
            <Text style={styles.statLabel}>Total Steps</Text>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statColumn}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.totalWorkouts > 0 ? Math.floor(stats.totalSteps / stats.totalWorkouts) : 0}</Text>
            <Text style={styles.statLabel}>Avg per Workout</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{formatNumber(stats.totalSeeds)}</Text>
            <Text style={styles.statLabel}>Seeds Grown</Text>
          </View>
        </View>
      </View>
      
      {/* Current Workout Stats */}
      <Card>
        <View style={styles.mainStats}>
          <Text style={styles.bigNumber}>{formatNumber(stats.workoutSteps)}</Text>
          <Text style={styles.bigLabel}>Current Workout Steps</Text>
          <Text style={styles.duration}>Duration: {formatDuration(workoutDuration)}</Text>
        </View>
      </Card>
      
      {/* Session Progress */}
      <Card title="Session Progress">
        <View style={styles.sessionStats}>
          <View style={styles.sessionStat}>
            <Text style={styles.sessionValue}>{currentWorkout.sessionXP}</Text>
            <Text style={styles.sessionLabel}>Session XP</Text>
          </View>
          <View style={styles.sessionStat}>
            <Text style={styles.sessionValue}>{currentWorkout.seeds}</Text>
            <Text style={styles.sessionLabel}>Seeds Grown</Text>
          </View>
        </View>
      </Card>
      
      {/* Companion Tracker */}
      {selectedCompanion && xpProgress && (
        <Card title="Companion Tracker">
          <View style={styles.companionTracker}>
            <Text style={styles.companionName}>{selectedCompanion.name}</Text>
            <Text style={styles.companionLevel}>Level {selectedCompanion.level}</Text>
            <ProgressBar
              current={xpProgress.current}
              max={xpProgress.needed}
              label="Experience"
              color="#2196F3"
              showPercentage
            />
            {selectedCompanion.sessionXP > 0 && (
              <Text style={styles.sessionXP}>+{selectedCompanion.sessionXP} XP this session</Text>
            )}
          </View>
        </Card>
      )}
      
      {/* Debug Controls */}
      {settings.debugMode && (
        <Card title="Debug Controls">
          <View style={styles.debugGrid}>
            <Button
              title="+100"
              onPress={() => addSteps(100)}
              variant="secondary"
              size="small"
            />
            <Button
              title="+1000"
              onPress={() => addSteps(1000)}
              variant="secondary"
              size="small"
            />
            <Button
              title={settings.stepSource === 'health' ? 'Sync Health' : 'Check Steps'}
              onPress={handleCheckSteps}
              variant="secondary"
              size="small"
            />
          </View>
        </Card>
      )}
      
      {/* End Workout Button */}
      <Button
        title="End Workout"
        onPress={handleEndWorkout}
        variant="danger"
        size="large"
        style={styles.endButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    minWidth: 200,
  },
  mainStats: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#2196F3',
  },
  bigLabel: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  duration: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionStat: {
    alignItems: 'center',
  },
  sessionValue: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  sessionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  companionTracker: {
    alignItems: 'center',
  },
  companionName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  companionLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
  sessionXP: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600' as const,
    marginTop: 8,
  },
  debugGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  endButton: {
    marginTop: 16,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});