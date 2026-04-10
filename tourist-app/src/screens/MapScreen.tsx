// src/screens/MapScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Animated, SafeAreaView, Modal,
} from 'react-native';
import { BEACH_ENTRIES, BeachEntry, BeachStatus } from '../data/mockData';
import { StatusBadge } from '../ui/StatusBadge';
import { NudgeModal } from '../components/NudgeModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_COLORS: Record<BeachStatus, string> = {
  green: '#22C55E', yellow: '#EAB308', red: '#EF4444',
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

const MAP_WIDTH  = SCREEN_WIDTH * 2.2;
const MAP_HEIGHT = 290;

const ZONE = {
  forestBot: 0.22,
  sandTop:   0.22,
  sandBot:   0.50,
  seaTop:    0.50,
};

// ─── Admin Alert Banner ──────────────────────────────────────────
const AdminAlertBanner: React.FC<{ alert: BeachEntry['adminAlerts'][0] }> = ({ alert }) => {
  const bg  = alert.severity === 'critical' ? '#450a0a' : '#422006';
  const border = alert.severity === 'critical' ? '#991b1b' : '#92400e';
  const iconBg = alert.severity === 'critical' ? '#7f1d1d' : '#78350f';

  return (
    <View style={[styles.alertBanner, { backgroundColor: bg, borderColor: border }]}>
      <View style={[styles.alertBannerIcon, { backgroundColor: iconBg }]}>
        <Text style={styles.alertBannerIconText}>{alert.icon}</Text>
      </View>
      <View style={styles.alertBannerBody}>
        <Text style={[
          styles.alertBannerTitle,
          { color: alert.severity === 'critical' ? '#fca5a5' : '#fcd34d' },
        ]}>
          {alert.title}
        </Text>
        <Text style={styles.alertBannerMsg}>{alert.message}</Text>
      </View>
    </View>
  );
};

// ─── Karta szczegółów z alertami admina ─────────────────────────
const EntryDetailModal: React.FC<{
  entry: BeachEntry | null;
  visible: boolean;
  onClose: () => void;
  onNudge: () => void;
}> = ({ entry, visible, onClose, onNudge }) => {
  if (!entry) return null;

  const hasAdminAlerts = (entry.adminAlerts?.length ?? 0) > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
          {/* Uchwyt */}
          <View style={styles.sheetHandle} />

          {/* Nagłówek */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{entry.name}</Text>
              {hasAdminAlerts ? (
                <Text style={styles.sheetAlertCount}>
                  ⚠️ {entry.adminAlerts!.length} aktywne alerty służb
                </Text>
              ) : (
                <Text style={styles.sheetSub}>Informacje o wejściu</Text>
              )}
            </View>
            <StatusBadge status={entry.status} size="md" />
          </View>

          {/* Alerty admina – prominentne banery */}
          {hasAdminAlerts && (
            <View style={styles.adminAlertsSection}>
              {entry.adminAlerts!.map((a) => (
                <AdminAlertBanner key={a.id} alert={a} />
              ))}
            </View>
          )}

          {/* Zajętość */}
          <View style={styles.sheetRow}>
            <Text style={styles.sheetRowLabel}>Zajętość piasku</Text>
            <View style={styles.occBarBg}>
              <View
                style={[
                  styles.occBarFill,
                  { width: `${entry.occupancy}%` as any, backgroundColor: STATUS_COLORS[entry.status] },
                ]}
              />
            </View>
            <Text style={[styles.sheetRowValue, { color: STATUS_COLORS[entry.status] }]}>
              {entry.occupancy}%
            </Text>
          </View>

          {/* CTA dla tłumu */}
          {entry.status === 'red' && !hasAdminAlerts && (
            <TouchableOpacity style={styles.nudgeBtn} onPress={() => { onClose(); onNudge(); }}>
              <Text style={styles.nudgeBtnText}>🎁 Prowadź na wolną plażę i odbierz nagrodę</Text>
            </TouchableOpacity>
          )}

          {entry.status === 'red' && hasAdminAlerts && (
            <View style={styles.dangerNote}>
              <Text style={styles.dangerNoteText}>
                ⛔ Ze względu na aktywne alerty bezpieczeństwa, kąpiel w tym miejscu nie jest zalecana.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Zamknij</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Główny ekran ────────────────────────────────────────────────
export const MapScreen: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<BeachEntry | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [nudgeVisible,  setNudgeVisible]  = useState(false);
  const [navigatingTo,  setNavigatingTo]  = useState<string | null>(null);

  const redPulse  = useRef(new Animated.Value(1)).current;
  const navPulse  = useRef(new Animated.Value(1)).current;
  const navGlow   = useRef(new Animated.Value(0)).current;
  const mapScrollRef = useRef<ScrollView>(null);

  // Pulsowanie RED
  useEffect(() => {
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(redPulse, { toValue: 1.35, duration: 700, useNativeDriver: true }),
      Animated.timing(redPulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, []);

  // Pulsowanie celu nawigacji
  useEffect(() => {
    if (!navigatingTo) { navPulse.setValue(1); navGlow.setValue(0); return; }
    const anim = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(navPulse, { toValue: 1.7, duration: 550, useNativeDriver: true }),
        Animated.timing(navGlow,  { toValue: 1,   duration: 550, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(navPulse, { toValue: 1,   duration: 550, useNativeDriver: true }),
        Animated.timing(navGlow,  { toValue: 0.2, duration: 550, useNativeDriver: true }),
      ]),
    ]));
    anim.start();
    return () => anim.stop();
  }, [navigatingTo]);

  // ── Auto-scroll mapy do wybranego markera ───────────────────────
  const scrollToEntry = (entryId: string) => {
    const pos = ENTRY_POSITIONS[entryId];
    if (!pos || !mapScrollRef.current) return;
    const markerX = (pos.x / 100) * MAP_WIDTH;
    const targetX = markerX - SCREEN_WIDTH / 2;
    mapScrollRef.current.scrollTo({ x: Math.max(0, targetX), animated: true });
  };

  const handleMarkerPress = (entry: BeachEntry) => {
    setSelectedEntry(entry);
    setDetailVisible(true);
    scrollToEntry(entry.id);
  };

  const handleListRowPress = (entry: BeachEntry) => {
    setSelectedEntry(entry);
    setDetailVisible(true);
    scrollToEntry(entry.id);
  };

  const handleNavigate = () => {
    setNudgeVisible(false);
    if (selectedEntry?.nearestGreen) {
      setNavigatingTo(selectedEntry.nearestGreen);
      const target = BEACH_ENTRIES.find((e) => e.id === selectedEntry.nearestGreen);
      if (target) { setSelectedEntry(target); scrollToEntry(target.id); }
    }
  };

  const getGreenEntryById = (id?: string) => BEACH_ENTRIES.find((e) => e.id === id) ?? null;

  const stats = {
    green:  BEACH_ENTRIES.filter((e) => e.status === 'green').length,
    yellow: BEACH_ENTRIES.filter((e) => e.status === 'yellow').length,
    red:    BEACH_ENTRIES.filter((e) => e.status === 'red').length,
  };

  const totalAlerts = BEACH_ENTRIES.reduce(
    (sum, e) => sum + (e.adminAlerts?.length ?? 0), 0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>DenSea 🌊</Text>
          <Text style={styles.headerSub}>Mapa wejść na plażę – Sopot</Text>
        </View>
        <View style={styles.headerRight}>
          {totalAlerts > 0 && (
            <View style={styles.alertPill}>
              <Text style={styles.alertPillText}>⚠️ {totalAlerts} alert</Text>
            </View>
          )}
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
      </View>

      {/* Baner nawigacji */}
      {navigatingTo && (
        <View style={styles.navBanner}>
          <Text style={styles.navBannerIcon}>🗺</Text>
          <Text style={styles.navBannerText}>
            Prowadzisz do:{' '}
            <Text style={styles.navBannerHL}>
              {BEACH_ENTRIES.find((e) => e.id === navigatingTo)?.name}
            </Text>
          </Text>
          <TouchableOpacity onPress={() => setNavigatingTo(null)}>
            <Text style={styles.navBannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MAPA */}
      <View style={styles.mapContainer}>
        <ScrollView ref={mapScrollRef} horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>

            {/* Las */}
            <View style={[styles.forestArea, { height: ZONE.forestBot * MAP_HEIGHT }]}>
              {Array.from({ length: 28 }).map((_, i) => (
                <Text
                  key={i}
                  style={[styles.treeIcon, {
                    left: i * (MAP_WIDTH / 28) + (i % 3) * 4,
                    top: (i % 2 === 0 ? 2 : 8),
                    fontSize: 12 + (i % 3) * 3,
                    opacity: 0.65 + (i % 3) * 0.1,
                  }]}
                >🌲</Text>
              ))}
              <Text style={styles.forestLabel}>🌲 Las Nadmorski</Text>
            </View>

            {/* Promenada */}
            <View style={[styles.promenadeStrip, { top: ZONE.forestBot * MAP_HEIGHT - 5 }]} />

            {/* Piasek */}
            <View style={[styles.sandArea, {
              top: ZONE.sandTop * MAP_HEIGHT,
              height: (ZONE.sandBot - ZONE.sandTop) * MAP_HEIGHT,
            }]}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.sandLine, { top: 4 + i * 12, opacity: 0.12 + i * 0.03 }]} />
              ))}
              <Text style={styles.sandLabel}>🏖 Plaża</Text>
            </View>

            {/* Pianki brzegowe */}
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={[styles.waveDecor, {
                  left: i * (MAP_WIDTH / 40),
                  top: ZONE.sandBot * MAP_HEIGHT - 6 + (i % 3 === 0 ? 3 : i % 3 === 1 ? 0 : -3),
                  opacity: 0.45 + (i % 2) * 0.2,
                }]}
              />
            ))}

            {/* Morze */}
            <View style={[styles.seaArea, { top: ZONE.seaTop * MAP_HEIGHT }]}>
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={[styles.waveLine, { top: 10 + i * 22, opacity: 0.1 - i * 0.02 }]} />
              ))}
              <Text style={styles.seaLabel}>🌊 Morze Bałtyckie</Text>
            </View>

            {/* MARKERY */}
            {BEACH_ENTRIES.map((entry) => {
              const pos = ENTRY_POSITIONS[entry.id];
              const isSelected  = selectedEntry?.id === entry.id;
              const isNavTarget = navigatingTo === entry.id;
              const isRed       = entry.status === 'red';
              const hasAlert    = (entry.adminAlerts?.length ?? 0) > 0;

              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[styles.markerContainer, {
                    left: (pos.x / 100) * MAP_WIDTH - 22,
                    top:  (pos.y / 100) * MAP_HEIGHT - 50,
                  }]}
                  onPress={() => handleMarkerPress(entry)}
                  activeOpacity={0.8}
                >
                  {/* Pulse */}
                  {isRed && !isNavTarget && (
                    <Animated.View style={[styles.pulseRing, {
                      backgroundColor: 'rgba(239,68,68,0.35)',
                      transform: [{ scale: redPulse }],
                    }]} />
                  )}

                  {/* Nav target glow */}
                  {isNavTarget && (
                    <Animated.View style={[styles.navGlowOuter, { opacity: navGlow, transform: [{ scale: navPulse }] }]} />
                  )}

                  {/* Marker */}
                  <View style={[styles.marker, {
                    backgroundColor: STATUS_COLORS[entry.status],
                    borderColor: isNavTarget ? '#FFFFFF' : isSelected ? '#0F172A' : '#FFFFFF',
                    borderWidth: (isNavTarget || isSelected) ? 3 : 2,
                    width:  isNavTarget ? 34 : 28,
                    height: isNavTarget ? 34 : 28,
                    borderRadius: isNavTarget ? 17 : 14,
                  }]}>
                    {isNavTarget && <Text style={styles.markerStar}>★</Text>}
                    {hasAlert && !isNavTarget && <Text style={styles.markerAlertDot}>!</Text>}
                  </View>

                  {/* Etykieta */}
                  <View style={[
                    styles.markerLabel,
                    isSelected  && styles.markerLabelSelected,
                    isNavTarget && styles.markerLabelNav,
                  ]}>
                    <Text style={[
                      styles.markerLabelText,
                      (isSelected || isNavTarget) && { color: '#FFFFFF' },
                    ]}>
                      {entry.name.replace('Wejście ', 'W')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Legenda – bez "Las" */}
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

      {/* Lista wejść */}
      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.listTitle}>Wszystkie wejścia</Text>
        {BEACH_ENTRIES.map((entry) => {
          const hasAlert = (entry.adminAlerts?.length ?? 0) > 0;
          return (
            <TouchableOpacity
              key={entry.id}
              style={[
                styles.entryRow,
                selectedEntry?.id === entry.id && styles.entryRowSelected,
                navigatingTo === entry.id     && styles.entryRowNav,
              ]}
              onPress={() => handleListRowPress(entry)}
              activeOpacity={0.7}
            >
              <View style={[styles.entryRowDot, { backgroundColor: STATUS_COLORS[entry.status] }]} />
              <Text style={styles.entryRowName}>{entry.name}</Text>
              <View style={styles.entryRowBar}>
                <View style={[styles.entryRowBarFill, {
                  width: `${entry.occupancy}%` as any,
                  backgroundColor: STATUS_COLORS[entry.status],
                }]} />
              </View>
              <Text style={styles.entryRowOcc}>{entry.occupancy}%</Text>
              {hasAlert && (
                <View style={styles.entryAlertDot}>
                  <Text style={styles.entryAlertDotText}>!</Text>
                </View>
              )}
              <StatusBadge status={entry.status} size="sm" showDot={false} />
              {navigatingTo === entry.id && <Text style={styles.entryRowNavStar}>★</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal szczegółów (Bottom Sheet) */}
      <EntryDetailModal
        entry={selectedEntry}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onNudge={() => setNudgeVisible(true)}
      />

      {/* Modal propozycji */}
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
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerSub:   { fontSize: 11, color: '#64748B', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertPill:   { backgroundColor: '#FEF2F2', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#FECACA' },
  alertPillText: { fontSize: 11, fontWeight: '700', color: '#B91C1C' },
  headerStats: { flexDirection: 'row', gap: 5 },
  statPill:    { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20 },
  statText:    { fontSize: 11, fontWeight: '700' },

  // Nav baner
  navBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#DCFCE7', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#BBF7D0' },
  navBannerIcon:  { fontSize: 16 },
  navBannerText:  { flex: 1, fontSize: 12, color: '#14532D' },
  navBannerHL:    { fontWeight: '800', color: '#15803D' },
  navBannerClose: { fontSize: 16, color: '#15803D', fontWeight: '700' },

  // Mapa
  mapContainer: { height: MAP_HEIGHT + 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', overflow: 'hidden', position: 'relative' },
  forestArea: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#166534', overflow: 'hidden', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' },
  treeIcon: { position: 'absolute' },
  forestLabel: { position: 'absolute', bottom: 4, left: 12, fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '700', letterSpacing: 0.5 },
  promenadeStrip: { position: 'absolute', left: 0, right: 0, height: 9, backgroundColor: '#e5e7eb', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#d1d5db' },
  sandArea: { position: 'absolute', left: 0, right: 0, backgroundColor: '#FDE68A', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  sandLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#F59E0B', borderRadius: 1 },
  sandLabel: { fontSize: 11, color: 'rgba(120,80,0,0.4)', fontWeight: '700' },
  waveDecor: { position: 'absolute', width: 13, height: 4, borderRadius: 3, backgroundColor: '#60A5FA' },
  seaArea:  { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#0EA5E9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  waveLine: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#FFFFFF', borderRadius: 2 },
  seaLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },

  // Markery
  markerContainer: { position: 'absolute', alignItems: 'center', width: 44 },
  pulseRing: { position: 'absolute', width: 38, height: 38, borderRadius: 19, top: 0 },
  navGlowOuter: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(34,197,94,0.35)', top: -11 },
  marker: { alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6, zIndex: 10 },
  markerStar:     { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  markerAlertDot: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  markerLabel: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2, marginTop: 3 },
  markerLabelSelected: { backgroundColor: '#0F172A' },
  markerLabelNav:      { backgroundColor: '#15803D' },
  markerLabelText: { fontSize: 9, fontWeight: '700', color: '#0F172A' },

  // Legenda
  legend: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 10, padding: 7, gap: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  legendTitle: { fontSize: 9, fontWeight: '700', color: '#64748B', marginBottom: 2 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 7, height: 7, borderRadius: 4 },
  legendText:  { fontSize: 9, color: '#374151', fontWeight: '500' },

  // Lista wejść
  entriesList: { flex: 1, paddingHorizontal: 16 },
  listTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  entryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  entryRowSelected: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' },
  entryRowNav:      { borderColor: '#22C55E', backgroundColor: '#F0FDF4', borderWidth: 2 },
  entryRowDot:  { width: 9, height: 9, borderRadius: 5 },
  entryRowName: { fontSize: 13, fontWeight: '600', color: '#1E293B', width: 85 },
  entryRowBar:  { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  entryRowBarFill: { height: '100%', borderRadius: 3 },
  entryRowOcc:  { fontSize: 11, fontWeight: '700', color: '#374151', width: 32, textAlign: 'right' },
  entryAlertDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  entryAlertDotText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  entryRowNavStar: { color: '#16A34A', fontWeight: '900', fontSize: 13 },

  // ── Bottom Sheet Modal ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32, maxHeight: '80%' },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle:   { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sheetAlertCount: { fontSize: 12, color: '#B91C1C', fontWeight: '600', marginTop: 2 },
  sheetSub:     { fontSize: 12, color: '#64748B', marginTop: 2 },

  // Admin alerty w bottom sheet
  adminAlertsSection: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  alertBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 12, padding: 12, borderWidth: 1 },
  alertBannerIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  alertBannerIconText: { fontSize: 18 },
  alertBannerBody: { flex: 1 },
  alertBannerTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  alertBannerMsg:   { fontSize: 12, color: '#fef2f2', opacity: 0.8, lineHeight: 18 },

  // Zajętość w sheet
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12 },
  sheetRowLabel: { fontSize: 12, color: '#64748B', width: 110 },
  occBarBg:  { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  occBarFill:{ height: '100%', borderRadius: 4 },
  sheetRowValue: { fontSize: 13, fontWeight: '700', width: 36, textAlign: 'right' },

  // Nudge / danger
  nudgeBtn: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  nudgeBtnText: { color: '#1D4ED8', fontWeight: '700', fontSize: 13 },
  dangerNote: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FECACA' },
  dangerNoteText: { color: '#991B1B', fontSize: 12, fontWeight: '600', lineHeight: 18 },
  closeBtn: { marginHorizontal: 16, marginTop: 4, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14, alignItems: 'center' },
  closeBtnText: { color: '#475569', fontWeight: '700', fontSize: 14 },
});

export default MapScreen;
