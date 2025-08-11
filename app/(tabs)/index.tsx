import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Footprints, Dumbbell, Trees } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { ProgressBar } from '@/components/ProgressBar';
import { formatNumber } from '@/utils/helpers';

export default function HomeScreen() {
  const {
    stats,
    selectedCompanion
  } = useApp();
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Cardiopolis</Text>
            <Text style={styles.subtitle}>Your walking adventure awaits!</Text>
          </View>
          
          {/* Today's Steps Card */}
          <View style={styles.stepsCard}>
            <Text style={styles.cardTitle}>Today&apos;s Steps</Text>
            <Text style={styles.stepsCount}>{formatNumber(stats.dailySteps)}</Text>
            <View style={styles.stepsStats}>
              <View style={styles.statItem}>
                <Footprints size={16} color="#666" />
                <Text style={styles.statText}>Daily: {formatNumber(stats.dailySteps)}</Text>
              </View>
              <View style={styles.statItem}>
                <Dumbbell size={16} color="#666" />
                <Text style={styles.statText}>Workout: {formatNumber(stats.workoutSteps)}</Text>
              </View>
            </View>
          </View>
          
          {/* Companion Card - Smaller Version */}
          {selectedCompanion && (
            <View style={styles.companionCard}>
              <View style={styles.companionHeader}>
                <View style={styles.companionAvatar}>
                  <Text style={styles.avatarText}>{selectedCompanion.name.charAt(0)}</Text>
                </View>
                <View style={styles.companionInfo}>
                  <Text style={styles.companionName}>{selectedCompanion.name}</Text>
                  <Text style={styles.companionRole}>Hunter</Text>
                  <Text style={styles.companionLevel}>Level {selectedCompanion.level}</Text>
                </View>
                <View style={styles.xpContainer}>
                  <Text style={styles.xpText}>{selectedCompanion.totalXP}/500</Text>
                </View>
              </View>
              <ProgressBar 
                current={selectedCompanion.totalXP} 
                max={500} 
                color="#000" 
                height={6}
              />
            </View>
          )}
          
          {/* Current Zone Card */}
          <View style={styles.zoneCard}>
            <View style={styles.zoneIcon}>
              <Trees size={24} color="white" />
            </View>
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneName}>Grass Meadows</Text>
              <Text style={styles.zoneDescription}>Current exploration zone</Text>
            </View>
          </View>
          

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  stepsCard: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepsCount: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  companionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  companionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: 'white',
  },
  companionInfo: {
    flex: 1,
  },
  companionName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  companionRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  companionLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  zoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  zoneDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

});