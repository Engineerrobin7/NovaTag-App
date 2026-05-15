import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { StatusBadge } from '@components/StatusBadge';
import type { SavedTracker } from '@/types/tracker';

interface TrackerCardProps {
  tracker: SavedTracker;
  onPress: () => void;
}

const BatteryIcon: React.FC<{ level: number | null; color: string }> = ({
  level,
  color,
}) => {
  if (level === null) return null;
  const name =
    level > 80
      ? 'battery-full'
      : level > 50
      ? 'battery-half'
      : level > 20
      ? 'battery-low'
      : 'battery-dead';
  return <Icon name={name} size={14} color={color} />;
};

export const TrackerCard: React.FC<TrackerCardProps> = ({
  tracker,
  onPress,
}) => {
  const { colors, typography, spacing, radius, shadow } = useTheme();
  const liveState = useTrackerStore((s) => s.liveStates[tracker.id]);

  const connectionState = liveState?.connectionState ?? 'disconnected';
  const battery = liveState?.batteryLevel ?? null;
  const rssi = liveState?.rssi ?? tracker.metadata.lastRssi ?? null;

  const lastSeen = tracker.metadata.lastSeen
    ? new Date(tracker.metadata.lastSeen).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: colors.backgroundCard,
          borderRadius: radius.xl,
          padding: spacing.base,
          borderWidth: 1,
          borderColor: colors.border,
        },
        shadow.sm,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            backgroundColor: `${colors.primary}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}
        >
          <Icon name="radio" size={24} color={colors.primary} />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text
            style={[typography.headingSmall, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {tracker.customName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
              gap: spacing.sm,
            }}
          >
            <StatusBadge state={connectionState} />
          </View>
        </View>

        {/* Right meta */}
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {battery !== null && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <BatteryIcon level={battery} color={colors.textTertiary} />
              <Text style={[typography.caption, { color: colors.textTertiary }]}>
                {battery}%
              </Text>
            </View>
          )}
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            {lastSeen}
          </Text>
          {rssi !== null && (
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              {rssi} dBm
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
