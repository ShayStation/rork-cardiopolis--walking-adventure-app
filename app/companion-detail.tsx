import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { X, Star, User } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { COMPANION_TYPES } from '@/constants/game-config';
import { calculateLevel, getXPProgress } from '@/utils/helpers';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/Button';

export default function CompanionDetailScreen() {
  const { companionId } = useLocalSearchParams<{ companionId: string }>();
  const router = useRouter();
  const { companions, selectCompanion } = useApp();
  
  const companion = companions.find(c => c.id === companionId);
  
  if (!companion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Companion not found</Text>
      </SafeAreaView>
    );
  }
  
  const type = COMPANION_TYPES.find(t => t.id === companion.typeId);
  const level = calculateLevel(companion.totalXP);
  const xpProgress = getXPProgress(companion.totalXP);
  
  const handleSelect = () => {
    selectCompanion(companion.id);
    router.back();
  };
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{companion.name}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{type?.name}</Text>
            <Text style={styles.level}>Level {level}</Text>
            {companion.isSelected && (
              <View style={styles.selectedBadge}>
                <Star size={16} color="#4CAF50" fill="#4CAF50" />
              </View>
            )}
          </View>
          
          <Text style={styles.description}>
            View detailed information about {companion.name} and their abilities.
          </Text>
          
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience Progress</Text>
            <Text style={styles.xpText}>{xpProgress.current}/{xpProgress.needed} XP</Text>
            <ProgressBar
              current={xpProgress.current}
              max={xpProgress.needed}
              color="#4CAF50"
            />
            <Text style={styles.nextLevelText}>{xpProgress.needed - xpProgress.current} XP to next level</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attributes</Text>
            
            <View style={styles.attribute}>
              <View style={styles.attributeHeader}>
                <Text style={styles.attributeName}>Speed</Text>
                <Text style={styles.attributeValue}>{type?.baseStats.speed}/10</Text>
              </View>
              <ProgressBar
                current={type?.baseStats.speed || 0}
                max={10}
                color="#4CAF50"
              />
            </View>
            
            <View style={styles.attribute}>
              <View style={styles.attributeHeader}>
                <Text style={styles.attributeName}>Stamina</Text>
                <Text style={styles.attributeValue}>{type?.baseStats.stamina}/10</Text>
              </View>
              <ProgressBar
                current={type?.baseStats.stamina || 0}
                max={10}
                color="#4CAF50"
              />
            </View>
            
            <View style={styles.attribute}>
              <View style={styles.attributeHeader}>
                <Text style={styles.attributeName}>Luck</Text>
                <Text style={styles.attributeValue}>{type?.baseStats.luck}/10</Text>
              </View>
              <ProgressBar
                current={type?.baseStats.luck || 0}
                max={10}
                color="#4CAF50"
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              {companion.name} is a skilled {type?.name.toLowerCase()} who excels at {type?.role.toLowerCase()}. 
              Their keen senses help discover hidden treasures during expeditions.
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title={companion.isSelected ? "Selected" : "Select Companion"}
            onPress={handleSelect}
            variant={companion.isSelected ? "secondary" : "primary"}
            disabled={companion.isSelected}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  level: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  selectedBadge: {
    marginLeft: 'auto',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  nextLevelText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  attribute: {
    marginBottom: 20,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeName: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4CAF50',
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});