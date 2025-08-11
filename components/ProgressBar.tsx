import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

export function ProgressBar({ 
  current, 
  max, 
  label, 
  color = '#4CAF50',
  showPercentage = false,
  height = 8
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{Math.floor(percentage)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${percentage}%`,
              backgroundColor: color,
              height
            }
          ]} 
        />
      </View>
      <Text style={styles.values}>
        {current} / {max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500' as const,
  },
  percentage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600' as const,
  },
  track: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  values: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});