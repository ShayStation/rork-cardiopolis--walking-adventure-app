import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Flower, TreePine, Cast, Snowflake } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BIOMES } from '@/constants/game-config';

export default function VillageScreen() {
  const {
    stats,
    currentBiome,
    biomeResources,
    settings,
    setBiome,
    resetSeeds
  } = useApp();
  
  const [selectedBiomeId, setSelectedBiomeId] = useState(currentBiome.id);
  
  const handleBiomeChange = (biomeId: string) => {
    setSelectedBiomeId(biomeId);
    setBiome(biomeId);
  };
  
  const handleResetSeeds = () => {
    Alert.alert(
      'Reset Seeds',
      'This will reset all seeds to 0. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetSeeds }
      ]
    );
  };
  
  const getBiomeIcon = (biomeId: string) => {
    switch (biomeId) {
      case 'grass': return <Flower size={24} color="#4CAF50" />;
      case 'wetland': return <TreePine size={24} color="#03A9F4" />;
      case 'desert': return <Cast size={24} color="#FF9800" />;
      case 'winter': return <Snowflake size={24} color="#9C27B0" />;
      default: return null;
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: currentBiome.backgroundColor }]}
      contentContainerStyle={styles.content}
    >
      {/* Resources */}
      <Card title="Village Resources">
        <View style={styles.resourceGrid}>
          <View style={styles.resource}>
            <Text style={styles.resourceValue}>{stats.totalSeeds}</Text>
            <Text style={styles.resourceLabel}>Seeds</Text>
          </View>
          <View style={styles.resource}>
            <Text style={styles.resourceValue}>{biomeResources[currentBiome.id] || 0}</Text>
            <Text style={styles.resourceLabel}>{currentBiome.uniqueResourceName}</Text>
          </View>
        </View>
      </Card>
      
      {/* Biome Selector */}
      <Card title="Select Biome">
        <View style={styles.biomeGrid}>
          {BIOMES.map(biome => (
            <TouchableOpacity
              key={biome.id}
              style={[
                styles.biomeCard,
                selectedBiomeId === biome.id && styles.selectedBiome,
                { borderColor: biome.accentColor }
              ]}
              onPress={() => handleBiomeChange(biome.id)}
            >
              {getBiomeIcon(biome.id)}
              <Text style={styles.biomeName}>{biome.name}</Text>
              <Text style={styles.biomeResource}>{biome.uniqueResourceName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      {/* Village Upgrades (Placeholder) */}
      <Card title="Village Upgrades">
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeName}>Seed Storage</Text>
          <Text style={styles.upgradeDesc}>Increase seed capacity by 100</Text>
          <View style={styles.upgradeCost}>
            <Text style={styles.costText}>Cost: 50 Seeds</Text>
          </View>
          <Button
            title="Upgrade"
            onPress={() => Alert.alert('Coming Soon', 'Village upgrades will be available soon!')}
            variant="primary"
            size="small"
            disabled={stats.totalSeeds < 50}
          />
        </View>
        
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeName}>Resource Collector</Text>
          <Text style={styles.upgradeDesc}>Automatically collect biome resources</Text>
          <View style={styles.upgradeCost}>
            <Text style={styles.costText}>Cost: 100 Seeds + 20 {currentBiome.uniqueResourceName}</Text>
          </View>
          <Button
            title="Upgrade"
            onPress={() => Alert.alert('Coming Soon', 'Village upgrades will be available soon!')}
            variant="primary"
            size="small"
            disabled={stats.totalSeeds < 100}
          />
        </View>
      </Card>
      
      {/* Debug Actions */}
      {settings.debugMode && (
        <Card title="Debug Actions">
          <Button
            title="Reset Seeds"
            onPress={handleResetSeeds}
            variant="danger"
            size="small"
          />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  resourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resource: {
    alignItems: 'center',
  },
  resourceValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1A1A1A',
  },
  resourceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  biomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  biomeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedBiome: {
    borderWidth: 3,
  },
  biomeName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginTop: 8,
  },
  biomeResource: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  upgradeCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  upgradeName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  upgradeDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  upgradeCost: {
    marginTop: 8,
    marginBottom: 12,
  },
  costText: {
    fontSize: 12,
    color: '#999',
  },
});