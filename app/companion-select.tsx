import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/providers/app-provider';
import { CompanionCard } from '@/components/CompanionCard';
import { Button } from '@/components/Button';

export default function CompanionSelectScreen() {
  const router = useRouter();
  const { companions, selectCompanion, startWorkout } = useApp();
  
  const handleSelect = (companionId: string) => {
    selectCompanion(companionId);
    startWorkout(companionId);
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Choose Your Companion</Text>
        <Text style={styles.subtitle}>
          Select a companion to join you on your workout
        </Text>
        
        <View style={styles.list}>
          {companions.map(companion => (
            <CompanionCard
              key={companion.id}
              companion={companion}
              onSelect={() => handleSelect(companion.id)}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  list: {
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});