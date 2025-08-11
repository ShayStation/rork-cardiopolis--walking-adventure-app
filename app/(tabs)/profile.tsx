import React from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { MapPin, Activity, Footprints } from 'lucide-react-native';
import { useApp } from '@/providers/app-provider';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { formatNumber } from '@/utils/helpers';

export default function ProfileScreen() {
  const {
    stats,
    discoveries,
    settings,
    toggleDebugMode,
    setStepSource,
    toggleHotspot,
    resetAllData
  } = useApp();
  
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: resetAllData
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Lifetime Stats */}
      <Card title="Lifetime Stats">
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Footprints size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{formatNumber(stats.totalSteps)}</Text>
            <Text style={styles.statLabel}>Total Steps</Text>
          </View>
          <View style={styles.statItem}>
            <Activity size={24} color="#2196F3" />
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={24} color="#FF9800" />
            <Text style={styles.statValue}>{stats.totalDiscoveries}</Text>
            <Text style={styles.statLabel}>Discoveries</Text>
          </View>
        </View>
      </Card>
      
      {/* Discovery Log */}
      <Card title="Recent Discoveries">
        {discoveries.length === 0 ? (
          <Text style={styles.emptyText}>No discoveries yet</Text>
        ) : (
          discoveries.slice(-5).reverse().map(discovery => (
            <View key={discovery.id} style={styles.discoveryItem}>
              <Text style={styles.discoveryName}>
                {discovery.villagerName || 'Unknown Villager'}
              </Text>
              <Text style={styles.discoveryInfo}>
                {discovery.hotspotType} • {new Date(discovery.at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </Card>
      
      {/* Settings */}
      <Card title="Settings">
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Debug Mode</Text>
          <Switch
            value={settings.debugMode}
            onValueChange={toggleDebugMode}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Step Source</Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Debug"
              onPress={() => setStepSource('debug')}
              variant={settings.stepSource === 'debug' ? 'primary' : 'secondary'}
              size="small"
            />
            <Button
              title="Health"
              onPress={() => setStepSource('health')}
              variant={settings.stepSource === 'health' ? 'primary' : 'secondary'}
              size="small"
            />
          </View>
        </View>
        
        {settings.stepSource === 'health' && (
          <View style={styles.healthStatus}>
            <Text style={styles.healthStatusText}>
              ✅ Health integration enabled. Steps are automatically synced from your device&apos;s health app.
            </Text>
          </View>
        )}
        
        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>Active Hotspots</Text>
          <View style={styles.hotspotList}>
            {(['park', 'stadium', 'theater'] as const).map(hotspot => (
              <View key={hotspot} style={styles.hotspotItem}>
                <Text style={styles.hotspotLabel}>
                  {hotspot.charAt(0).toUpperCase() + hotspot.slice(1)}
                </Text>
                <Switch
                  value={settings.activeHotspots.includes(hotspot)}
                  onValueChange={() => toggleHotspot(hotspot)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                />
              </View>
            ))}
          </View>
        </View>
      </Card>
      
      {/* Danger Zone */}
      <Card title="Danger Zone">
        <Button
          title="Reset All Data"
          onPress={handleResetData}
          variant="danger"
        />
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  discoveryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  discoveryName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  discoveryInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  settingSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  hotspotList: {
    gap: 8,
  },
  hotspotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  hotspotLabel: {
    fontSize: 14,
    color: '#666',
  },
  healthStatus: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  healthStatusText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
});