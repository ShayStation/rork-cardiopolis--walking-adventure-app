import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Companion } from '@/types/models';
import { COMPANION_TYPES } from '@/constants/game-config';
import { calculateLevel } from '@/utils/helpers';

interface CompanionCardProps {
  companion: Companion;
}

export function CompanionCard({ companion }: CompanionCardProps) {
  const router = useRouter();
  const type = COMPANION_TYPES.find(t => t.id === companion.typeId);
  const level = calculateLevel(companion.totalXP);
  
  const handlePress = () => {
    router.push(`/companion-detail?companionId=${companion.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, companion.isSelected && styles.selected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, companion.isSelected && styles.selectedAvatar]}>
          <User size={24} color={companion.isSelected ? '#FFFFFF' : '#666'} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{companion.name}</Text>
          <Text style={styles.type}>{type?.name} • Level {level}</Text>
        </View>
        {companion.isSelected && (
          <View style={styles.selectedBadge}>
            <Star size={16} color="#4CAF50" fill="#4CAF50" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  type: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  selectedBadge: {
    marginLeft: 8,
  },
  selectedAvatar: {
    backgroundColor: '#4CAF50',
  },
});