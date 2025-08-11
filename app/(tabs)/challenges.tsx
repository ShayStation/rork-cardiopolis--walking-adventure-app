import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Lock, CheckCircle } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Challenge } from '@/types/models';

export default function ChallengesScreen() {
  const { challenges, badges } = useApp();
  
  const dailyChallenges = challenges.filter(c => c.period === 'daily');
  const weeklyChallenges = challenges.filter(c => c.period === 'weekly');
  const monthlyChallenges = challenges.filter(c => c.period === 'monthly');
  
  const renderChallenge = (challenge: Challenge) => (
    <View key={challenge.id} style={styles.challengeItem}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeName}>{challenge.name}</Text>
        {challenge.completed && <CheckCircle size={20} color="#4CAF50" />}
      </View>
      <Text style={styles.challengeDesc}>{challenge.description}</Text>
      <ProgressBar
        current={challenge.progress}
        max={challenge.goal}
        color={challenge.completed ? '#4CAF50' : '#2196F3'}
        showPercentage
      />
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      {/* Daily Challenges */}
      <Card title="Daily Challenges">
        {dailyChallenges.map(renderChallenge)}
      </Card>
      
      {/* Weekly Challenges */}
      <Card title="Weekly Challenges">
        {weeklyChallenges.map(renderChallenge)}
      </Card>
      
      {/* Monthly Challenges */}
      <Card title="Monthly Challenges">
        {monthlyChallenges.map(renderChallenge)}
      </Card>
      
      {/* Badges */}
      <Card title="Badges">
        <View style={styles.badgeGrid}>
          {badges.map(badge => (
            <View 
              key={badge.id} 
              style={[
                styles.badgeItem,
                !badge.unlocked && styles.lockedBadge
              ]}
            >
              {badge.unlocked ? (
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
              ) : (
                <Lock size={24} color="#999" />
              )}
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  challengeItem: {
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  challengeDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '30%',
    aspectRatio: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  lockedBadge: {
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginTop: 8,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});