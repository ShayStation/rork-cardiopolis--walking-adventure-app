import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/providers/app-provider';
import { CompanionCard } from '@/components/CompanionCard';
import { Button } from '@/components/Button';
import { COMPANION_TYPES } from '@/constants/game-config';

export default function CompanionsScreen() {
  const {
    companions,
    settings,
    selectCompanion,
    resetSelectedCompanionLevel,
    regenerateCompanions
  } = useApp();
  
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredCompanions = filterType
    ? companions.filter(c => c.typeId === filterType)
    : companions;
  
  const handleRegenerate = () => {
    Alert.alert(
      'Regenerate Companions',
      'This will reset all companions. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', style: 'destructive', onPress: regenerateCompanions }
      ]
    );
  };
  
  const handleResetLevel = () => {
    const selected = companions.find(c => c.isSelected);
    if (!selected) {
      Alert.alert('No Selection', 'Please select a companion first');
      return;
    }
    
    Alert.alert(
      'Reset Companion Level',
      `Reset ${selected.name} to level 1?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetSelectedCompanionLevel }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button
          title="All"
          onPress={() => setFilterType(null)}
          variant={filterType === null ? 'primary' : 'secondary'}
          size="small"
        />
        {COMPANION_TYPES.map(type => (
          <Button
            key={type.id}
            title={type.name}
            onPress={() => setFilterType(type.id)}
            variant={filterType === type.id ? 'primary' : 'secondary'}
            size="small"
          />
        ))}
      </View>
      
      {/* Companion List */}
      <View style={styles.list}>
        {filteredCompanions.map(companion => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            onSelect={() => selectCompanion(companion.id)}
            showDetails
          />
        ))}
      </View>
      
      {/* Debug Actions */}
      {settings.debugMode && (
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Debug Actions</Text>
          <View style={styles.debugButtons}>
            <Button
              title="Regenerate All"
              onPress={handleRegenerate}
              variant="danger"
              size="small"
            />
            <Button
              title="Reset Selected Level"
              onPress={handleResetLevel}
              variant="danger"
              size="small"
            />
          </View>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  list: {
    padding: 16,
  },
  debugSection: {
    padding: 16,
    backgroundColor: '#FFF3E0',
    marginTop: 16,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FF9800',
    marginBottom: 12,
  },
  debugButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
});