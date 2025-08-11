import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { Companion } from '@/types/models';
import { COMPANION_TYPES } from '@/constants/game-config';
import { calculateLevel, getXPProgress } from '@/utils/helpers';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

interface CompanionCardProps {
  companion: Companion;
  onSelect?: () => void;
  showDetails?: boolean;
}

export function CompanionCard({ companion, onSelect, showDetails = false }: CompanionCardProps) {
  const type = COMPANION_TYPES.find(t => t.id === companion.typeId);
  const level = calculateLevel(companion.totalXP);
  const xpProgress = getXPProgress(companion.totalXP);
  
  return (
    <TouchableOpacity 
      style={[styles.card, companion.isSelected && styles.selected]}
      onPress={onSelect}
      disabled={!onSelect}
      activeOpacity={onSelect ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={32} color={companion.isSelected ? '#4CAF50' : '#666'} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{companion.name}</Text>
          <Text style={styles.type}>{type?.name} • Level {level}</Text>
        </View>
        {companion.isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </View>
      
      {showDetails && (
        <>
          <ProgressBar
            current={xpProgress.current}
            max={xpProgress.needed}
            label="Experience"
            color="#2196F3"
          />
          
          {companion.sessionXP > 0 && (
            <Text style={styles.sessionXP}>+{companion.sessionXP} XP this session</Text>
          )}
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Speed</Text>
              <Text style={styles.statValue}>{type?.baseStats.speed}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Stamina</Text>
              <Text style={styles.statValue}>{type?.baseStats.stamina}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Luck</Text>
              <Text style={styles.statValue}>{type?.baseStats.luck}</Text>
            </View>
          </View>
        </>
      )}
      
      {onSelect && (
        <Button
          title={companion.isSelected ? "Unselect" : "Select"}
          onPress={onSelect}
          variant={companion.isSelected ? "secondary" : "primary"}
          size="small"
          style={styles.button}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
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
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  type: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  sessionXP: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600' as const,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginTop: 2,
  },
  button: {
    marginTop: 12,
  },
});