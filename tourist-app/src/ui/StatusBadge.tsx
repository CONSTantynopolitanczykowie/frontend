// src/ui/StatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BeachStatus } from '../data/mockData';

interface StatusBadgeProps {
  status: BeachStatus;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  showDot?: boolean;
}

const STATUS_CONFIG = {
  green: {
    label: 'Luźno',
    bg: '#DCFCE7',
    text: '#15803D',
    dot: '#22C55E',
    border: '#BBF7D0',
  },
  yellow: {
    label: 'Średnio',
    bg: '#FEF9C3',
    text: '#A16207',
    dot: '#EAB308',
    border: '#FDE68A',
  },
  red: {
    label: 'Tłok!',
    bg: '#FEE2E2',
    text: '#B91C1C',
    dot: '#EF4444',
    border: '#FECACA',
  },
};

const SIZE_CONFIG = {
  sm: { fontSize: 11, paddingH: 8, paddingV: 3, dotSize: 6 },
  md: { fontSize: 13, paddingH: 12, paddingV: 5, dotSize: 8 },
  lg: { fontSize: 15, paddingH: 16, paddingV: 7, dotSize: 10 },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  style,
  showDot = true,
}) => {
  const config = STATUS_CONFIG[status];
  const sizeConf = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingHorizontal: sizeConf.paddingH,
          paddingVertical: sizeConf.paddingV,
        },
        style,
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: config.dot,
              width: sizeConf.dotSize,
              height: sizeConf.dotSize,
            },
          ]}
        />
      )}
      <Text
        style={[styles.label, { color: config.text, fontSize: sizeConf.fontSize }]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 100,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default StatusBadge;
