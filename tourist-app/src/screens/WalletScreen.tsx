// src/screens/WalletScreen.tsx
// Przyjmuje nagrody przez props (stan globalny z App.tsx)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Reward } from '../data/mockData';
import { RewardCard } from '../ui/RewardCard';

interface WalletScreenProps {
  rewards: Reward[];
  onUse: (id: string) => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ rewards, onUse }) => {
  const activeCount = rewards.filter((r) => !r.used).length;
  const totalSaved = '16 zł';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mój Portfel 💛</Text>
          <Text style={styles.headerSub}>DenSea Nagrody</Text>
        </View>

        {/* Karta podsumowania */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryGradient}>
            <View style={[styles.decCircle, { width: 120, height: 120, top: -30, right: -20 }]} />
            <View style={[styles.decCircle, { width: 80, height: 80, bottom: -20, left: 20 }]} />

            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.summaryLabel}>Aktywne kupony</Text>
                <Text style={styles.summaryValue}>{activeCount}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View>
                <Text style={styles.summaryLabel}>Łączne oszczędności</Text>
                <Text style={styles.summaryValue}>{totalSaved}</Text>
              </View>
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelIcon}>🏅</Text>
              <View>
                <Text style={styles.levelTitle}>Poziom: Odkrywca Plaż</Text>
                <Text style={styles.levelSub}>Odwiedź 5 wolnych wejść → Złoty Surfer</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statsy gamifikacji */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>3</Text>
            <Text style={styles.statBoxLabel}>Odwiedzone wejścia</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>2×</Text>
            <Text style={styles.statBoxLabel}>Wybrałem wolną plażę</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>🌊 4</Text>
            <Text style={styles.statBoxLabel}>Odznak DenSea</Text>
          </View>
        </View>

        {/* Sekcja aktywnych kuponów */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktywne kupony</Text>
            {activeCount > 0 && (
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{activeCount}</Text>
              </View>
            )}
          </View>

          {rewards.filter((r) => !r.used).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>Brak aktywnych kuponów</Text>
              <Text style={styles.emptyDesc}>
                Wybierz wolniejsze wejście na plażę, gdy widzisz "tłok", by zdobyć nagrody!
              </Text>
            </View>
          ) : (
            rewards.filter((r) => !r.used).map((reward) => (
              <RewardCard key={reward.id} reward={reward} onUse={onUse} />
            ))
          )}
        </View>

        {/* Sekcja wykorzystanych */}
        {rewards.filter((r) => r.used).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wykorzystane</Text>
            {rewards.filter((r) => r.used).map((reward) => (
              <RewardCard key={reward.id} reward={reward} onUse={onUse} />
            ))}
          </View>
        )}

        {/* Info jak zdobyć nagrody */}
        <View style={styles.howToCard}>
          <Text style={styles.howToTitle}>Jak zdobywać nagrody? 🤔</Text>
          {[
            { icon: '🔴', text: 'Kliknij w czerwony marker na mapie (tłok)' },
            { icon: '🗺', text: 'Wybierz opcję "Prowadź na wolną plażę"' },
            { icon: '🎁', text: 'Kupon pojawi się automatycznie w portfelu' },
            { icon: '📱', text: 'Pokaż kod QR w restauracji i odbierz zniżkę!' },
          ].map((step, i) => (
            <View key={i} style={styles.howToStep}>
              <Text style={styles.howToIcon}>{step.icon}</Text>
              <Text style={styles.howToText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F9FF' },
  scroll: { padding: 16 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  summaryCard: { borderRadius: 22, overflow: 'hidden', marginBottom: 16 },
  summaryGradient: { backgroundColor: '#0EA5E9', padding: 22, overflow: 'hidden', position: 'relative' },
  decCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)' },
  summaryContent: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20, position: 'relative', zIndex: 1 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  summaryValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 2 },
  summaryDivider: { width: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.3)' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12, position: 'relative', zIndex: 1 },
  levelIcon: { fontSize: 22 },
  levelTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  levelSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statBoxValue: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  statBoxLabel: { fontSize: 10, color: '#64748B', textAlign: 'center', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  sectionBadge: { backgroundColor: '#0EA5E9', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginTop: -10 },
  sectionBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  emptyDesc: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  howToCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  howToTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  howToStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  howToIcon: { fontSize: 18, width: 24 },
  howToText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 20 },
});

export default WalletScreen;
