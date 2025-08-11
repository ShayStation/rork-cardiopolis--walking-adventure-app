import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Footprints, Sprout, Clock } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { formatDuration, formatNumber } from '@/utils/helpers';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const { currentWorkout, stats, selectedCompanion, endWorkout, workoutDuration } = useApp();
  
  if (!currentWorkout) {
    router.back();
    return null;
  }
  
  const handleApplyAndSave = () => {
    endWorkout();
    router.replace('/(tabs)/(home)');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Trophy size={48} color="#FFD700" />
        <Text style={styles.title}>Workout Complete!</Text>
        <Text style={styles.subtitle}>Great job on your workout</Text>
      </View>
      
      <Card>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Clock size={24} color="#2196F3" />
            <Text style={styles.summaryValue}>{formatDuration(workoutDuration)}</Text>
            <Text style={styles.summaryLabel}>Duration</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Footprints size={24} color="#4CAF50" />
            <Text style={styles.summaryValue}>{formatNumber(stats.workoutSteps)}</Text>
            <Text style={styles.summaryLabel}>Steps</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Sprout size={24} color="#8BC34A" />
            <Text style={styles.summaryValue}>{currentWorkout.seeds}</Text>
            <Text style={styles.summaryLabel}>Seeds Grown</Text>
          </View>
        </View>
      </Card>
      
      {selectedCompanion && (
        <Card title="Companion Progress">
          <View style={styles.companionSummary}>
            <Text style={styles.companionName}>{selectedCompanion.name}</Text>
            <Text style={styles.xpGained}>+{selectedCompanion.sessionXP} XP gained</Text>
            <Text style={styles.companionLevel}>
              Level {selectedCompanion.level} → {
                Math.floor((selectedCompanion.totalXP + selectedCompanion.sessionXP) / 100) + 1
              }
            </Text>
          </View>
        </Card>
      )}
      
      <Card title="Session Stats">
        <View style={styles.statsList}>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Session XP</Text>
            <Text style={styles.statsValue}>{currentWorkout.sessionXP}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Avg. Pace</Text>
            <Text style={styles.statsValue}>
              {workoutDuration > 0 
                ? Math.round(stats.workoutSteps / (workoutDuration / 60)) 
                : 0} steps/min
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Seed Rate</Text>
            <Text style={styles.statsValue}>
              1 seed / 500 steps
            </Text>
          </View>
        </View>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Apply & Save"
          onPress={handleApplyAndSave}
          variant="success"
          size="large"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  companionSummary: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  companionName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  xpGained: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600' as const,
    marginTop: 8,
  },
  companionLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsList: {
    paddingVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
});