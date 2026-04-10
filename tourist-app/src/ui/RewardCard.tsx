// src/ui/RewardCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { Reward } from '../data/mockData';

interface RewardCardProps {
  reward: Reward;
  onUse?: (id: string) => void;
}

const QRCodeDisplay: React.FC<{ code: string }> = ({ code }) => (
  <View style={qrStyles.container}>
    <View style={qrStyles.imageWrapper}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('../../assets/qr.png')}
        style={qrStyles.image}
        resizeMode="contain"
      />
    </View>
    <Text style={qrStyles.codeText}>{code}</Text>
  </View>
);

const qrStyles = StyleSheet.create({
  container:    { alignItems: 'center', gap: 10 },
  imageWrapper: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  image:        { width: 180, height: 180 },
  codeText:     { fontSize: 11, color: '#64748B', letterSpacing: 1.5, fontFamily: 'monospace' },
});

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onUse }) => {
  const [showQR, setShowQR] = useState(false);

  const isExpired = new Date(reward.expiresAt) < new Date();

  return (
    <>
      <View style={[styles.card, reward.used && styles.cardUsed]}>
        {/* Lewa belka kolorowa */}
        <View style={[styles.stripe, reward.used && styles.stripeUsed]} />

        <View style={styles.content}>
          {/* Nagłówek */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Text style={styles.icon}>{reward.used ? '✓' : '🎁'}</Text>
            </View>
            <View style={styles.titleArea}>
              <Text style={[styles.title, reward.used && styles.titleUsed]}>
                {reward.title}
              </Text>
              <Text style={styles.partner}>{reward.partner}</Text>
            </View>
            <View style={[styles.discountBadge, reward.used && styles.discountBadgeUsed]}>
              <Text style={[styles.discountText, reward.used && styles.discountTextUsed]}>
                {reward.discount}
              </Text>
            </View>
          </View>

          {/* Opis */}
          <Text style={[styles.description, reward.used && styles.descriptionUsed]}>
            {reward.description}
          </Text>

          {/* Stopka */}
          <View style={styles.footer}>
            <Text style={styles.expiry}>
              Ważność: {new Date(reward.expiresAt).toLocaleDateString('pl-PL')}
            </Text>
            {!reward.used && !isExpired && (
              <TouchableOpacity
                style={styles.useButton}
                onPress={() => setShowQR(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.useButtonText}>Użyj →</Text>
              </TouchableOpacity>
            )}
            {reward.used && (
              <Text style={styles.usedLabel}>Wykorzystany</Text>
            )}
          </View>
        </View>
      </View>

      {/* Modal z QR kodem */}
      <Modal
        visible={showQR}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQR(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.sheet}>
            <View style={modalStyles.handle} />
            <Text style={modalStyles.title}>Pokaż kasjerowi kod QR</Text>
            <Text style={modalStyles.rewardTitle}>{reward.title}</Text>
            <Text style={modalStyles.partnerName}>{reward.partner}</Text>

            <View style={modalStyles.qrWrapper}>
              <QRCodeDisplay code={reward.qrCode} />
            </View>

            <View style={modalStyles.divider} />
            <Text style={modalStyles.hint}>
              Kupon wygasa: {new Date(reward.expiresAt).toLocaleDateString('pl-PL')}
            </Text>

            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => {
                setShowQR(false);
                onUse?.(reward.id);
              }}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.closeButtonText}>Oznacz jako użyty</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowQR(false)}>
              <Text style={modalStyles.cancelText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  cardUsed: {
    backgroundColor: '#F8FAFC',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stripe: {
    width: 5,
    backgroundColor: '#0EA5E9',
  },
  stripeUsed: {
    backgroundColor: '#CBD5E1',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  titleUsed: {
    color: '#94A3B8',
  },
  partner: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  discountBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountBadgeUsed: {
    backgroundColor: '#F1F5F9',
  },
  discountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  discountTextUsed: {
    color: '#94A3B8',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  descriptionUsed: {
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  expiry: {
    fontSize: 11,
    color: '#94A3B8',
  },
  useButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  useButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  usedLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  rewardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  partnerName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  qrWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  hint: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#0EA5E9',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
});

export default RewardCard;
