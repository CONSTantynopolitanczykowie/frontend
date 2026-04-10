// App.tsx – Tourist App Root
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MapScreen } from './src/screens/MapScreen';
import { WalletScreen } from './src/screens/WalletScreen';

type Tab = 'map' | 'wallet';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('map');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

      {/* Zawartość ekranu */}
      <View style={styles.content}>
        {activeTab === 'map' ? <MapScreen /> : <WalletScreen />}
      </View>

      {/* Dolna nawigacja */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'map' && styles.tabIconActive]}>🗺</Text>
          <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>
            Mapa Plaży
          </Text>
          {activeTab === 'map' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'wallet' && styles.tabActive]}
          onPress={() => setActiveTab('wallet')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'wallet' && styles.tabIconActive]}>💛</Text>
          <Text style={[styles.tabLabel, activeTab === 'wallet' && styles.tabLabelActive]}>
            Portfel
          </Text>
          {activeTab === 'wallet' && <View style={styles.tabIndicator} />}
          {/* Badge z liczbą nagród */}
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>2</Text>
          </View>
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
  // Tab bar
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
  tabActive: {
    // Aktywna zakładka
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
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: '25%',
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
