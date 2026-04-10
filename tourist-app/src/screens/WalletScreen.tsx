// src/screens/WalletScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Reward, PLAYER } from '../data/mockData';
import { RewardCard } from '../ui/RewardCard';

interface WalletScreenProps {
  rewards: Reward[];
  onUse: (id: string) => void;
}

// ─── Pasek XP / Grywalizacja (styl premium jak w grach) ──────────
const XPCard: React.FC = () => {
  const xpPct = Math.round((PLAYER.xp / PLAYER.xpRequired) * 100);

  const RANK_COLORS = [
    { from: '#0ea5e9', to: '#6366f1' }, // poziom 1-3
    { from: '#f59e0b', to: '#ef4444' }, // poziom 4+
  ];
  const colors = PLAYER.level <= 3 ? RANK_COLORS[0] : RANK_COLORS[1];

  return (
    <View style={xpStyles.card}>
      {/* Dekoracyjne tło */}
      <View style={[xpStyles.decCircle, { width: 160, height: 160, top: -50, right: -30, opacity: 0.08 }]} />
      <View style={[xpStyles.decCircle, { width: 90,  height: 90,  bottom: -30, left: -10, opacity: 0.06 }]} />

      {/* Rząd górny: poziom + ranga */}
      <View style={xpStyles.topRow}>
        <View style={xpStyles.levelBadge}>
          <Text style={xpStyles.levelNum}>{PLAYER.level}</Text>
        </View>
        <View style={xpStyles.rankInfo}>
          <Text style={xpStyles.rankLabel}>RANGA</Text>
          <Text style={xpStyles.rankName}>{PLAYER.levelName}</Text>
        </View>
        <View style={xpStyles.xpCounter}>
          <Text style={xpStyles.xpLabel}>EXP</Text>
          <Text style={xpStyles.xpValue}>
            <Text style={xpStyles.xpCurrent}>{PLAYER.xp}</Text>
            <Text style={xpStyles.xpSep}> / </Text>
            <Text style={xpStyles.xpMax}>{PLAYER.xpRequired}</Text>
          </Text>
        </View>
      </View>

      {/* Pasek postępu */}
      <View style={xpStyles.barSection}>
        <View style={xpStyles.barBg}>
          <View style={[xpStyles.barFill, { width: `${xpPct}%` as any }]}>
            {/* Migający efekt na końcu paska */}
            <View style={xpStyles.barShine} />
          </View>
        </View>
        <Text style={xpStyles.barPct}>{xpPct}%</Text>
      </View>

      {/* Cel / motywacja */}
      <View style={xpStyles.goalRow}>
        <Text style={xpStyles.goalIcon}>🏆</Text>
        <View style={xpStyles.goalText}>
          <Text style={xpStyles.goalNext}>Następna ranga: {PLAYER.nextLevelName}</Text>
          <Text style={xpStyles.goalHint}>
            Odwiedź wolną plażę → +50 XP · Zdobądź nagrodę → +30 XP
          </Text>
        </View>
      </View>

      {/* Minibadge stats */}
      <View style={xpStyles.statsRow}>
        <View style={xpStyles.statPill}>
          <Text style={xpStyles.statPillVal}>{PLAYER.totalVisits}</Text>
          <Text style={xpStyles.statPillLbl}>Odwiedzin</Text>
        </View>
        <View style={xpStyles.statPill}>
          <Text style={xpStyles.statPillVal}>{PLAYER.greenVisits}×</Text>
          <Text style={xpStyles.statPillLbl}>Wolna plaża</Text>
        </View>
        <View style={xpStyles.statPill}>
          <Text style={xpStyles.statPillVal}>🌊 {PLAYER.badges}</Text>
          <Text style={xpStyles.statPillLbl}>Odznaki</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Główny ekran ─────────────────────────────────────────────────
export const WalletScreen: React.FC<WalletScreenProps> = ({ rewards, onUse }) => {
  const activeCount = rewards.filter((r) => !r.used).length;
  const totalSaved  = '16 zł';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Portfel & Nagrody 💛</Text>
          <Text style={styles.headerSub}>DenSea · Twój profil gracza</Text>
        </View>

        {/* ── KARTA XP / POZIOM ── */}
        <XPCard />

        {/* Podsumowanie kuponów */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryVal}>{activeCount}</Text>
            <Text style={styles.summaryLbl}>Aktywne kupony</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryVal}>{totalSaved}</Text>
            <Text style={styles.summaryLbl}>Łączne oszczędności</Text>
          </View>
        </View>

        {/* Aktywne kupony */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktywne kupony</Text>
            {activeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeCount}</Text>
              </View>
            )}
          </View>

          {rewards.filter((r) => !r.used).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>Brak aktywnych kuponów</Text>
              <Text style={styles.emptyDesc}>
                Odwiedź wolną plażę gdy widzisz tłok, by zdobyć nagrody!
              </Text>
            </View>
          ) : (
            rewards.filter((r) => !r.used).map((r) => (
              <RewardCard key={r.id} reward={r} onUse={onUse} />
            ))
          )}
        </View>

        {/* Wykorzystane kupony */}
        {rewards.filter((r) => r.used).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wykorzystane</Text>
            {rewards.filter((r) => r.used).map((r) => (
              <RewardCard key={r.id} reward={r} onUse={onUse} />
            ))}
          </View>
        )}

        {/* Jak działają nagrody */}
        <View style={styles.howToCard}>
          <Text style={styles.howToTitle}>Jak zdobywać nagrody? 🤔</Text>
          {[
            { icon: '🔴', text: 'Kliknij w czerwony marker (tłok)' },
            { icon: '🗺', text: 'Wybierz "Prowadź na wolną plażę"' },
            { icon: '🎁', text: 'Kupon pojawi się w portfelu' },
            { icon: '📱', text: 'Pokaż kod QR i odbierz zniżkę!' },
          ].map((step, i) => (
            <View key={i} style={styles.howToStep}>
              <Text style={styles.howToIcon}>{step.icon}</Text>
              <Text style={styles.howToText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Style XP Karty ───────────────────────────────────────────────
const xpStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#0C1B2E',
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  decCircle: { position: 'absolute', borderRadius: 999, backgroundColor: '#0ea5e9' },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  levelBadge: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#0ea5e9',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0ea5e9', shadowOpacity: 0.5, shadowRadius: 8, elevation: 4,
  },
  levelNum: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  rankInfo: { flex: 1 },
  rankLabel: { fontSize: 9, fontWeight: '700', color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' },
  rankName:  { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  xpCounter: { alignItems: 'flex-end' },
  xpLabel:   { fontSize: 9, fontWeight: '700', color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' },
  xpValue:   { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  xpCurrent: { fontSize: 18, fontWeight: '900', color: '#0ea5e9' },
  xpSep:     { fontSize: 12, color: '#475569', fontWeight: '600' },
  xpMax:     { fontSize: 13, color: '#475569', fontWeight: '600' },

  barSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  barBg: {
    flex: 1, height: 10, backgroundColor: '#1e3a5f',
    borderRadius: 5, overflow: 'hidden',
  },
  barFill: {
    height: '100%', borderRadius: 5,
    backgroundColor: '#0ea5e9',
    position: 'relative',
    overflow: 'hidden',
  },
  barShine: {
    position: 'absolute', top: 0, bottom: 0, right: 0,
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 5,
  },
  barPct: { fontSize: 11, fontWeight: '700', color: '#0ea5e9', width: 32, textAlign: 'right' },

  goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16, backgroundColor: 'rgba(14,165,233,0.08)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(14,165,233,0.15)' },
  goalIcon: { fontSize: 18 },
  goalText: { flex: 1 },
  goalNext: { fontSize: 12, fontWeight: '700', color: '#e2e8f0' },
  goalHint: { fontSize: 10, color: '#64748b', marginTop: 3, lineHeight: 15 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statPillVal: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  statPillLbl: { fontSize: 9, color: '#64748b', marginTop: 2, textAlign: 'center' },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F9FF' },
  scroll:   { padding: 16 },

  header:      { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerSub:   { fontSize: 12, color: '#64748B', marginTop: 2 },

  summaryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  summaryBox:     { flex: 1, alignItems: 'center' },
  summaryVal:     { fontSize: 28, fontWeight: '900', color: '#0EA5E9' },
  summaryLbl:     { fontSize: 11, color: '#64748B', marginTop: 2 },
  summaryDivider: { width: 1, height: 44, backgroundColor: '#E2E8F0' },

  section:       { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle:  { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  badge:         { backgroundColor: '#0EA5E9', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText:     { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },

  emptyState: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  emptyIcon:  { fontSize: 36 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  emptyDesc:  { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },

  howToCard:  { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  howToTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  howToStep:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  howToIcon:  { fontSize: 18, width: 24 },
  howToText:  { flex: 1, fontSize: 13, color: '#475569', lineHeight: 20 },
});

export default WalletScreen;
