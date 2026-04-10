// src/screens/MapScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
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
  green: 'rgba(34, 197, 94, 0.4)',
  yellow: 'rgba(234, 179, 8, 0.35)',
  red: 'rgba(239, 68, 68, 0.4)',
};

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
const MAP_HEIGHT = 300; // nieznacznie wyższy by pomieścić strefę lasu

// ─── Stałe pionowe stref ───────────────────────────────────────────────────
// Las (od góry): 0%–22%
// Niebo (tło za lasem): 0%–22% – niebo/powietrze
// Ścieżka promenady: ~22%
// Piasek: 22%–48%
// Linia brzegowa/pianki: ~48%
// Morze: 48%–100%

const ZONE = {
  forestTop: 0,
  forestBot: 0.22,    // 22% od góry
  sandTop:   0.22,
  sandBot:   0.50,
  seaTop:    0.50,
};

export const MapScreen: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<BeachEntry | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Pulsowanie RED markerów (tłok)
  const redPulse = useRef(new Animated.Value(1)).current;
  // Rozszerzające pulsowanie celu nawigacji (zielony)
  const navPulse = useRef(new Animated.Value(1)).current;
  const navGlow  = useRef(new Animated.Value(0)).current;

  // Animacja czerwonych markerów – ciągła
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(redPulse, { toValue: 1.35, duration: 700, useNativeDriver: true }),
        Animated.timing(redPulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Animacja celu nawigacji – intensywne pulsowanie + glow
  useEffect(() => {
    if (!navigatingTo) {
      navPulse.setValue(1);
      navGlow.setValue(0);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(navPulse, { toValue: 1.7, duration: 550, useNativeDriver: true }),
          Animated.timing(navGlow,  { toValue: 1,   duration: 550, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(navPulse, { toValue: 1,   duration: 550, useNativeDriver: true }),
          Animated.timing(navGlow,  { toValue: 0.2, duration: 550, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [navigatingTo]);

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
      setNavigatingTo(selectedEntry.nearestGreen);
      // Ustaw docelowy jako zaznaczony
      const target = BEACH_ENTRIES.find((e) => e.id === selectedEntry.nearestGreen);
      if (target) setSelectedEntry(target);
    }
  };

  const stats = {
    green: BEACH_ENTRIES.filter((e) => e.status === 'green').length,
    yellow: BEACH_ENTRIES.filter((e) => e.status === 'yellow').length,
    red:    BEACH_ENTRIES.filter((e) => e.status === 'red').length,
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

      {/* Baner nawigacji */}
      {navigatingTo && (
        <View style={styles.navBanner}>
          <Text style={styles.navBannerIcon}>🗺</Text>
          <Text style={styles.navBannerText}>
            Prowadzisz do:{' '}
            <Text style={styles.navBannerHighlight}>
              {BEACH_ENTRIES.find((e) => e.id === navigatingTo)?.name}
            </Text>
            {' '}– podświetlono na mapie
          </Text>
          <TouchableOpacity onPress={() => setNavigatingTo(null)}>
            <Text style={styles.navBannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Zmockowana mapa */}
      <View style={[styles.mapContainer, { height: MAP_HEIGHT + 10 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>

            {/* ── STREFA LASU (góra, od lądu) ─────────────────────────── */}
            <View style={[styles.forestArea, { height: ZONE.forestBot * MAP_HEIGHT }]}>
              {/* Drzewa – dekoracyjne trójkąty emoji */}
              {Array.from({ length: 28 }).map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.treeIcon,
                    {
                      left: i * (MAP_WIDTH / 28) + (i % 3) * 4,
                      top: (i % 2 === 0 ? 2 : 8),
                      fontSize: 12 + (i % 3) * 3,
                      opacity: 0.7 + (i % 3) * 0.1,
                    },
                  ]}
                >
                  🌲
                </Text>
              ))}
              {/* Etykieta lasu */}
              <Text style={styles.forestLabel}>🌲 Las Nadmorski</Text>
            </View>

            {/* ── PROMENADA / DROGA ────────────────────────────────────── */}
            <View
              style={[
                styles.promenadeStrip,
                { top: ZONE.forestBot * MAP_HEIGHT - 5 },
              ]}
            />

            {/* ── STREFA PIASKU ────────────────────────────────────────── */}
            <View
              style={[
                styles.sandArea,
                {
                  top: ZONE.sandTop * MAP_HEIGHT,
                  height: (ZONE.sandBot - ZONE.sandTop) * MAP_HEIGHT,
                },
              ]}
            >
              {/* Fale piasku – dekoracyjne linie */}
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.sandLine,
                    { top: 4 + i * 12, opacity: 0.15 + i * 0.04 },
                  ]}
                />
              ))}
              <Text style={styles.sandLabel}>🏖 Plaża</Text>
            </View>

            {/* Animowane fale na linii wody */}
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveDecor,
                  {
                    left: i * (MAP_WIDTH / 40),
                    top: ZONE.sandBot * MAP_HEIGHT - 6 + (i % 3 === 0 ? 3 : i % 3 === 1 ? 0 : -3),
                    opacity: 0.5 + (i % 2) * 0.25,
                  },
                ]}
              />
            ))}

            {/* ── STREFA MORZA ─────────────────────────────────────────── */}
            <View
              style={[
                styles.seaArea,
                { top: ZONE.seaTop * MAP_HEIGHT },
              ]}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.waveLine, { top: 10 + i * 22, opacity: 0.12 - i * 0.02 }]}
                />
              ))}
              <Text style={styles.seaLabel}>🌊 Morze Bałtyckie</Text>
            </View>

            {/* ── MARKERY WEJŚĆ ────────────────────────────────────────── */}
            {BEACH_ENTRIES.map((entry) => {
              const pos = ENTRY_POSITIONS[entry.id];
              const isSelected   = selectedEntry?.id === entry.id;
              const isNavTarget  = navigatingTo === entry.id;
              const isRed        = entry.status === 'red';

              const markerLeft = (pos.x / 100) * MAP_WIDTH - 22;
              const markerTop  = (pos.y / 100) * MAP_HEIGHT - 50;

              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[styles.markerContainer, { left: markerLeft, top: markerTop }]}
                  onPress={() => handleMarkerPress(entry)}
                  activeOpacity={0.8}
                >
                  {/* Pulsujące tło – czerwone lub cel nawigacji */}
                  {isRed && !isNavTarget && (
                    <Animated.View
                      style={[
                        styles.pulseRing,
                        {
                          backgroundColor: STATUS_GLOW.red,
                          transform: [{ scale: redPulse }],
                        },
                      ]}
                    />
                  )}

                  {/* Intensywne pulsowanie celu nawigacji */}
                  {isNavTarget && (
                    <>
                      <Animated.View
                        style={[
                          styles.navGlowOuter,
                          {
                            opacity: navGlow,
                            transform: [{ scale: navPulse }],
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.navGlowInner,
                          { opacity: navGlow },
                        ]}
                      />
                    </>
                  )}

                  {/* Marker główny */}
                  <View
                    style={[
                      styles.marker,
                      {
                        backgroundColor: STATUS_COLORS[entry.status],
                        borderColor:
                          isNavTarget  ? '#FFFFFF' :
                          isSelected   ? '#0F172A' :
                          '#FFFFFF',
                        borderWidth: isNavTarget ? 3 : isSelected ? 3 : 2,
                        width:  isNavTarget ? 34 : 28,
                        height: isNavTarget ? 34 : 28,
                        borderRadius: isNavTarget ? 17 : 14,
                      },
                    ]}
                  >
                    {isNavTarget && (
                      <Text style={styles.markerNavIcon}>★</Text>
                    )}
                  </View>

                  {/* Etykieta */}
                  <View
                    style={[
                      styles.markerLabel,
                      isSelected  && styles.markerLabelSelected,
                      isNavTarget && styles.markerLabelNav,
                    ]}
                  >
                    <Text
                      style={[
                        styles.markerLabelText,
                        (isSelected || isNavTarget) && { color: '#FFFFFF' },
                      ]}
                    >
                      {entry.name.replace('Wejście ', 'W')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* ── Linia trasy do celu (prosta linia) ─────────────────── */}
            {navigatingTo && selectedEntry && selectedEntry.id !== navigatingTo && (() => {
              const fromPos = ENTRY_POSITIONS[selectedEntry.id];
              const toPos   = ENTRY_POSITIONS[navigatingTo];
              if (!fromPos || !toPos) return null;
              const x1 = (fromPos.x / 100) * MAP_WIDTH - 8;
              const y1 = (fromPos.y / 100) * MAP_HEIGHT - 36;
              const x2 = (toPos.x   / 100) * MAP_WIDTH - 8;
              const y2 = (toPos.y   / 100) * MAP_HEIGHT - 36;
              const dx = x2 - x1, dy = y2 - y1;
              const len = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              return (
                <View
                  style={{
                    position: 'absolute',
                    left: x1,
                    top: y1,
                    width: len,
                    height: 3,
                    backgroundColor: 'rgba(34,197,94,0.7)',
                    borderRadius: 2,
                    transform: [{ rotate: `${angle}deg` }],
                    transformOrigin: '0 50%',
                  }}
                />
              );
            })()}

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
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#15803D' }]} />
            <Text style={styles.legendText}>Las</Text>
          </View>
        </View>
      </View>

      {/* Karta szczegółów wybranego wejścia */}
      {selectedEntry && (
        <View style={[
          styles.detailCard,
          navigatingTo === selectedEntry.id && styles.detailCardNav,
        ]}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailName}>{selectedEntry.name}</Text>
              {navigatingTo === selectedEntry.id && (
                <Text style={styles.detailNavLabel}>🗺 Prowadzisz tutaj</Text>
              )}
            </View>
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
                      width: `${selectedEntry.occupancy}%` as any,
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
                <Text style={styles.detailNudgeBtnText}>
                  🎁 Zdobądź nagrodę – idź gdzie wolniej
                </Text>
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
              navigatingTo === entry.id     && styles.entryRowNav,
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
                  { width: `${entry.occupancy}%` as any, backgroundColor: STATUS_COLORS[entry.status] },
                ]}
              />
            </View>
            <Text style={styles.entryRowOcc}>{entry.occupancy}%</Text>
            <StatusBadge status={entry.status} size="sm" showDot={false} />
            {navigatingTo === entry.id && (
              <Text style={styles.entryRowNavStar}>★</Text>
            )}
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
  safeArea: { flex: 1, backgroundColor: '#F0F9FF' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerSub:   { fontSize: 12, color: '#64748B', marginTop: 2 },
  headerStats: { flexDirection: 'row', gap: 6 },
  statPill:    { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statText:    { fontSize: 12, fontWeight: '700' },

  // Baner nawigacji
  navBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#DCFCE7', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#BBF7D0',
  },
  navBannerIcon:      { fontSize: 18 },
  navBannerText:      { flex: 1, fontSize: 12, color: '#14532D', lineHeight: 16 },
  navBannerHighlight: { fontWeight: '800', color: '#15803D' },
  navBannerClose:     { fontSize: 16, color: '#15803D', fontWeight: '700' },

  // Mapa – kontenery
  mapContainer: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', overflow: 'hidden', position: 'relative' },

  // ── Las ──
  forestArea: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: '#166534',   // ciemna zieleń lasu
    overflow: 'hidden',
    flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap',
  },
  treeIcon: { position: 'absolute' },
  forestLabel: {
    position: 'absolute', bottom: 4, left: 12,
    fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 0.5,
  },

  // ── Promenada ──
  promenadeStrip: {
    position: 'absolute', left: 0, right: 0, height: 10,
    backgroundColor: '#E5E7EB',
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: '#D1D5DB',
  },

  // ── Piasek ──
  sandArea: {
    position: 'absolute', left: 0, right: 0,
    backgroundColor: '#FDE68A',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  sandLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#F59E0B', borderRadius: 1 },
  sandLabel: { fontSize: 12, color: 'rgba(120,80,0,0.45)', fontWeight: '700', letterSpacing: 0.5 },

  // Linia brzegowa
  waveDecor: { position: 'absolute', width: 14, height: 5, borderRadius: 3, backgroundColor: '#60A5FA' },

  // ── Morze ──
  seaArea: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  waveLine: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#FFFFFF', borderRadius: 2 },
  seaLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: '600', letterSpacing: 1 },

  // ── Markery ──
  markerContainer: { position: 'absolute', alignItems: 'center', width: 44 },
  pulseRing: { position: 'absolute', width: 38, height: 38, borderRadius: 19, top: 0 },

  // Cel nawigacji – glow pierścienie
  navGlowOuter: {
    position: 'absolute',
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(34, 197, 94, 0.35)',
    top: -11,
  },
  navGlowInner: {
    position: 'absolute',
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(34, 197, 94, 0.55)',
    top: -4,
  },

  marker: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 6, zIndex: 10,
  },
  markerNavIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  markerLabel: {
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6,
    paddingHorizontal: 4, paddingVertical: 2, marginTop: 3,
  },
  markerLabelSelected: { backgroundColor: '#0F172A' },
  markerLabelNav: { backgroundColor: '#15803D' },
  markerLabelText: { fontSize: 9, fontWeight: '700', color: '#0F172A' },

  // Legenda
  legend: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 10,
    padding: 8, gap: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  legendTitle: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 2 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 8, height: 8, borderRadius: 4 },
  legendText:  { fontSize: 10, color: '#374151', fontWeight: '500' },

  // Detail karta
  detailCard: {
    backgroundColor: '#FFFFFF', margin: 16, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  detailCardNav: { borderWidth: 2, borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  detailHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  detailName:    { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  detailNavLabel:{ fontSize: 11, color: '#16A34A', fontWeight: '600', marginTop: 2 },
  detailBody:    { gap: 10 },
  detailStat:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailStatLabel: { fontSize: 12, color: '#64748B', width: 110 },
  occupancyBarBg:  { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  occupancyBarFill:{ height: '100%', borderRadius: 4 },
  detailStatValue: { fontSize: 13, fontWeight: '700', color: '#0F172A', width: 36, textAlign: 'right' },
  detailNudgeBtn:  { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  detailNudgeBtnText: { color: '#1D4ED8', fontWeight: '700', fontSize: 13 },

  // Lista wejść
  entriesList: { flex: 1, paddingHorizontal: 16 },
  listTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', marginTop: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  entryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11, marginBottom: 6,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  entryRowSelected: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' },
  entryRowNav:      { borderColor: '#22C55E', backgroundColor: '#F0FDF4', borderWidth: 2 },
  entryRowDot:      { width: 10, height: 10, borderRadius: 5 },
  entryRowName:     { fontSize: 14, fontWeight: '600', color: '#1E293B', width: 90 },
  entryRowBar:      { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  entryRowBarFill:  { height: '100%', borderRadius: 3 },
  entryRowOcc:      { fontSize: 12, fontWeight: '700', color: '#374151', width: 35, textAlign: 'right' },
  entryRowNavStar:  { color: '#16A34A', fontWeight: '900', fontSize: 14 },
});

export default MapScreen;
