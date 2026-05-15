import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/index';
import type { ConnectionState } from '@/types/tracker';

interface StatusBadgeProps {
  state: ConnectionState;
}

const STATE_LABELS: Record<ConnectionState, string> = {
  connected: 'Connected',
  connecting: 'Connecting...',
  disconnecting: 'Disconnecting...',
  disconnected: 'Disconnected',
  error: 'Error',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ state }) => {
  const { colors, typography, spacing, radius } = useTheme();

  const getColor = () => {
    switch (state) {
      case 'connected': return colors.connected;
      case 'connecting':
      case 'disconnecting': return colors.connecting;
      case 'error': return colors.error;
      default: return colors.disconnected;
    }
  };

  const color = getColor();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${color}18`,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <Text style={[typography.labelSmall, { color }]}>
        {STATE_LABELS[state]}
      </Text>
    </View>
  );
};
