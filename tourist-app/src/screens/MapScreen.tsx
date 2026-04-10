// src/screens/MapScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { BEACH_ENTRIES, BeachEntry, BeachStatus } from '../data/mockData';
import { StatusBadge } from '../ui/StatusBadge';
import { NudgeModal } from '../components/NudgeModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_COLORS: Record<BeachStatus, string> = {
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
};

const STATUS_GLOW: Record<BeachStatus, string> = {
  green: 'rgba(34, 197, 94, 0.35)',
  yellow: 'rgba(234, 179, 8, 0.35)',
  red: 'rgba(239, 68, 68, 0.4)',
};

// Każde entry ma pozycję na zmockowanej mapie (x%, y%)
const ENTRY_POSITIONS: Record<string, { x: number; y: number }> = {
  w38: { x: 8,  y: 55 },
  w40: { x: 22, y: 48 },
  w42: { x: 38, y: 58 },
  w43: { x: 50, y: 45 },
  w45: { x: 63, y: 55 },
  w47: { x: 75, y: 46 },
  w49: { x: 86, y: 58 },
  w51: { x: 95, y: 50 },
};

const MAP_WIDTH = SCREEN_WIDTH * 2.2;
const MAP_HEIGHT = 280;

export const MapScreen: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<BeachEntry | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [navigating, setNavigating] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsowanie czerwonych markerów
  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const handleMarkerPress = (entry: BeachEntry) => {
    setSelectedEntry(entry);
    if (entry.status === 'red') {
      setNudgeVisible(true);
    }
  };

  const getGreenEntryById = (id?: string) =>
    BEACH_ENTRIES.find((e) => e.id === id) ?? null;

  const handleNavigate = () => {
    setNudgeVisible(false);
    if (selectedEntry?.nearestGreen) {
      setNavigating(selectedEntry.nearestGreen);
    }
  };

  const stats = {
    green: BEACH_ENTRIES.filter((e) => e.status === 'green').length,
    yellow: BEACH_ENTRIES.filter((e) => e.status === 'yellow').length,
    red: BEACH_ENTRIES.filter((e) => e.status === 'red').length,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>DenSea 🌊</Text>
          <Text style={styles.headerSub}>Mapa wejść na plażę – Sopot</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={[styles.statPill, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.statText, { color: '#15803D' }]}>🟢 {stats.green}</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#FEF9C3' }]}>
            <Text style={[styles.statText, { color: '#A16207' }]}>🟡 {stats.yellow}</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statText, { color: '#B91C1C' }]}>🔴 {stats.red}</Text>
          </View>
        </View>
      </View>

      {/* Zmockowana mapa */}
      <View style={styles.mapContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
            {/* Gradient nieba */}
            <View style={styles.skyArea} />

            {/* Pas piasku */}
            <View style={styles.sandArea}>
              {/* Linia brzegowa – strzępiasty efekt */}
              {Array.from({ length: 40 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveDecor,
                    {
                      left: i * (MAP_WIDTH / 40),
                      top: -6 + (i % 3 === 0 ? 3 : i % 3 === 1 ? 0 : -3),
                      opacity: 0.6 + (i % 2) * 0.2,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Morze */}
            <View style={styles.seaArea}>
              {/* Fale animowane (pseudo) */}
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.waveLine, { top: 15 + i * 18, opacity: 0.15 - i * 0.02 }]}
                />
              ))}
              <Text style={styles.seaLabel}>🌊 Morze Bałtyckie</Text>
            </View>

            {/* Markery wejść */}
            {BEACH_ENTRIES.map((entry) => {
              const pos = ENTRY_POSITIONS[entry.id];
              const isSelected = selectedEntry?.id === entry.id;
              const isNavigatingTo = navigating === entry.id;
              const isRed = entry.status === 'red';

              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.markerContainer,
                    {
                      left: (pos.x / 100) * MAP_WIDTH - 22,
                      top: (pos.y / 100) * MAP_HEIGHT - 50,
                    },
                  ]}
                  onPress={() => handleMarkerPress(entry)}
                  activeOpacity={0.8}
                >
                  {/* Pulsujące tło dla czerwonych */}
                  {isRed && (
                    <Animated.View
                      style={[
                        styles.pulse,
                        {
                          backgroundColor: STATUS_GLOW.red,
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    />
                  )}

                  {/* Marker główny */}
                  <View
                    style={[
                      styles.marker,
                      {
                        backgroundColor: STATUS_COLORS[entry.status],
                        borderColor: isSelected ? '#0F172A' : '#FFFFFF',
                        borderWidth: isSelected ? 3 : 2,
                      },
                    ]}
                  >
                    {isNavigatingTo && <Text style={styles.markerNav}>→</Text>}
                  </View>

                  {/* Etykieta */}
                  <View
                    style={[
                      styles.markerLabel,
                      isSelected && styles.markerLabelSelected,
                    ]}
                  >
                    <Text style={styles.markerLabelText}>{entry.name.replace('Wejście ', 'W')}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Ścieżka piesza (deptaki) */}
            <View style={[styles.promenade, { top: (55 / 100) * MAP_HEIGHT + 12 }]} />
          </View>
        </ScrollView>

        {/* Legenda mapy */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda</Text>
          {(['green', 'yellow', 'red'] as BeachStatus[]).map((s) => (
            <View key={s} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[s] }]} />
              <Text style={styles.legendText}>
                {s === 'green' ? 'Wolno' : s === 'yellow' ? 'Średnio' : 'Tłok'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Karta szczegółów wybranego wejścia */}
      {selectedEntry && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailName}>{selectedEntry.name}</Text>
            <StatusBadge status={selectedEntry.status} size="md" />
          </View>
          <View style={styles.detailBody}>
            <View style={styles.detailStat}>
              <Text style={styles.detailStatLabel}>Zajętość piasku</Text>
              <View style={styles.occupancyBarBg}>
                <View
                  style={[
                    styles.occupancyBarFill,
                    {
                      width: `${selectedEntry.occupancy}%`,
                      backgroundColor: STATUS_COLORS[selectedEntry.status],
                    },
                  ]}
                />
              </View>
              <Text style={styles.detailStatValue}>{selectedEntry.occupancy}%</Text>
            </View>
            {selectedEntry.status === 'red' && (
              <TouchableOpacity
                style={styles.detailNudgeBtn}
                onPress={() => setNudgeVisible(true)}
              >
                <Text style={styles.detailNudgeBtnText}>🎁 Zdobądź nagrodę – idź gdzie luźniej</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Lista wejść */}
      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.listTitle}>Wszystkie wejścia</Text>
        {BEACH_ENTRIES.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={[
              styles.entryRow,
              selectedEntry?.id === entry.id && styles.entryRowSelected,
            ]}
            onPress={() => handleMarkerPress(entry)}
            activeOpacity={0.7}
          >
            <View style={[styles.entryRowDot, { backgroundColor: STATUS_COLORS[entry.status] }]} />
            <Text style={styles.entryRowName}>{entry.name}</Text>
            <View style={styles.entryRowBar}>
              <View
                style={[
                  styles.entryRowBarFill,
                  { width: `${entry.occupancy}%`, backgroundColor: STATUS_COLORS[entry.status] },
                ]}
              />
            </View>
            <Text style={styles.entryRowOcc}>{entry.occupancy}%</Text>
            <StatusBadge status={entry.status} size="sm" showDot={false} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* NudgeModal */}
      <NudgeModal
        visible={nudgeVisible}
        crowdedEntry={selectedEntry}
        greenEntry={getGreenEntryById(selectedEntry?.nearestGreen)}
        onNavigate={handleNavigate}
        onStay={() => setNudgeVisible(false)}
        onClose={() => setNudgeVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Mapa
  mapContainer: {
    height: MAP_HEIGHT + 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  skyArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: (50 / 100) * MAP_HEIGHT,
    backgroundColor: '#BAE6FD',
  },
  sandArea: {
    position: 'absolute',
    top: (50 / 100) * MAP_HEIGHT - 10,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#FDE68A',
    flexDirection: 'row',
  },
  waveDecor: {
    position: 'absolute',
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60A5FA',
  },
  seaArea: {
    position: 'absolute',
    top: (50 / 100) * MAP_HEIGHT + 25,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  waveLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  seaLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  promenade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#D1FAE5',
    opacity: 0.7,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 44,
  },
  pulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    top: 3,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  markerNav: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  markerLabel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 3,
  },
  markerLabelSelected: {
    backgroundColor: '#0F172A',
  },
  markerLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F172A',
  },
  legend: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  // Detail karta
  detailCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailBody: {
    gap: 10,
  },
  detailStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#64748B',
    width: 110,
  },
  occupancyBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  occupancyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    width: 36,
    textAlign: 'right',
  },
  detailNudgeBtn: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  detailNudgeBtnText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 13,
  },
  // Lista
  entriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  entryRowSelected: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  entryRowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  entryRowName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    width: 90,
  },
  entryRowBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  entryRowBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  entryRowOcc: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    width: 35,
    textAlign: 'right',
  },
});

export default MapScreen;
