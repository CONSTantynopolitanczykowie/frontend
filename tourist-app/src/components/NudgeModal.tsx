// src/components/NudgeModal.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { BeachEntry } from '../data/mockData';
import PrimaryButton from '../ui/PrimaryButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NudgeModalProps {
  visible: boolean;
  crowdedEntry: BeachEntry | null;
  greenEntry: BeachEntry | null;
  onNavigate: () => void;
  onStay: () => void;
  onClose: () => void;
}

export const NudgeModal: React.FC<NudgeModalProps> = ({
  visible,
  crowdedEntry,
  greenEntry,
  onNavigate,
  onStay,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!crowdedEntry || !greenEntry) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Ciemne tło */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Uchwyt */}
        <View style={styles.handle} />

        {/* Czerwona sekcja alertu */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🚨</Text>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Potężny Tłok!</Text>
            <Text style={styles.alertSubtitle}>{crowdedEntry.name} – {crowdedEntry.occupancy}% zajętości</Text>
          </View>
          <View style={styles.occupancyBadge}>
            <Text style={styles.occupancyText}>{crowdedEntry.occupancy}%</Text>
          </View>
        </View>

        {/* Treść nudge */}
        <View style={styles.nudgeContent}>
          <Text style={styles.nudgeTitle}>Mamy dla Ciebie lepszą opcję! 🎯</Text>
          <Text style={styles.nudgeDescription}>
            Przejdź <Text style={styles.nudgeHighlight}>{crowdedEntry.distance}</Text> dalej na{' '}
            <Text style={styles.nudgeHighlight}>{greenEntry.name}</Text> – tam jest wolno!{' '}
            Odbierz nagrodę za wybór wolnej plaży:
          </Text>
        </View>

        {/* Karta nagrody w modalu */}
        <View style={styles.rewardPreview}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Zniżka na jedzenie</Text>
            <Text style={styles.rewardDesc}>6 zł rabatu w Smażalni Rybnej "Neptun"</Text>
          </View>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardBadgeText}>-6 zł</Text>
          </View>
        </View>

        {/* Wskazanie drogi – zielone wejście */}
        <View style={styles.destinationCard}>
          <View style={styles.destinationDot} />
          <View>
            <Text style={styles.destinationName}>{greenEntry.name}</Text>
            <Text style={styles.destinationStatus}>🟢 Wolno · {greenEntry.occupancy}% zajętości</Text>
          </View>
          <Text style={styles.destinationDistance}>{crowdedEntry.distance} →</Text>
        </View>

        {/* Przyciski akcji */}
        <View style={styles.actions}>
          <PrimaryButton
            label="🗺 Prowadź na wolną plażę"
            onPress={onNavigate}
            variant="primary"
            fullWidth
          />
          <PrimaryButton
            label="Zostaję w tłumie"
            onPress={onStay}
            variant="ghost"
            fullWidth
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  alertBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B91C1C',
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 2,
  },
  occupancyBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  occupancyText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  nudgeContent: {
    gap: 6,
  },
  nudgeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  nudgeDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  nudgeHighlight: {
    color: '#0EA5E9',
    fontWeight: '700',
  },
  rewardPreview: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  rewardDesc: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
  },
  rewardBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rewardBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  destinationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#14532D',
  },
  destinationStatus: {
    fontSize: 12,
    color: '#16A34A',
    marginTop: 2,
  },
  destinationDistance: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  actions: {
    gap: 8,
    marginTop: 4,
  },
});

export default NudgeModal;
