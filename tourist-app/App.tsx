// App.tsx – Tourist App Root z globalnym stanem rewards
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MapScreen } from './src/screens/MapScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { REWARDS, Reward } from './src/data/mockData';

type Tab = 'map' | 'wallet';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('map');

  // ── GLOBALNY STAN NAGRÓD ──────────────────────────────────────────────────
  // Trzymamy tutaj, żeby badge w tab barze był zsynchronizowany ze stanem
  const [rewards, setRewards] = React.useState<Reward[]>(REWARDS);

  const handleUseReward = (id: string) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, used: true } : r))
    );
  };

  const activeRewardsCount = rewards.filter((r) => !r.used).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

      {/* Zawartość ekranu */}
      <View style={styles.content}>
        {activeTab === 'map' ? (
          <MapScreen />
        ) : (
          <WalletScreen rewards={rewards} onUse={handleUseReward} />
        )}
      </View>

      {/* Dolna nawigacja */}
      <View style={styles.tabBar}>
        {/* Zakładka Mapy */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.7}
        >
          {activeTab === 'map' && <View style={styles.tabIndicator} />}
          <Text style={[styles.tabIcon, activeTab === 'map' && styles.tabIconActive]}>🗺</Text>
          <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>
            Mapa Plaży
          </Text>
        </TouchableOpacity>

        {/* Zakładka Portfela z dynamicznym badge */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'wallet' && styles.tabActive]}
          onPress={() => setActiveTab('wallet')}
          activeOpacity={0.7}
        >
          {activeTab === 'wallet' && <View style={styles.tabIndicator} />}
          <View style={styles.tabIconWrapper}>
            <Text style={[styles.tabIcon, activeTab === 'wallet' && styles.tabIconActive]}>💛</Text>
            {activeRewardsCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{activeRewardsCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === 'wallet' && styles.tabLabelActive]}>
            Portfel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 8,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
    gap: 2,
  },
  tabActive: {},
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#0EA5E9',
    fontWeight: '800',
  },
  // Badge dynamiczny z liczbą aktywnych kuponów
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 10,
  },
});
