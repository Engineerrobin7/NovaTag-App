import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { useTrackerConnection } from '@hooks/useTrackerConnection';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import { StatusBadge } from '@components/StatusBadge';
import { Card } from '@components/Card';
import type { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'TrackerDetail'>;

const InfoRow: React.FC<{ label: string; value: string | null }> = ({
  label,
  value,
}) => {
  const { colors, typography, spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[typography.labelMedium, { color: colors.textPrimary }]}>
        {value ?? '—'}
      </Text>
    </View>
  );
};

export const TrackerDetailScreen: React.FC<Props> = () => {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<Props['route']>();
  const { trackerId } = route.params;

  const tracker = useTrackerStore((s) =>
    s.savedTrackers.find((t) => t.id === trackerId),
  );
  const liveState = useTrackerStore((s) => s.liveStates[trackerId]);
  const removeTracker = useTrackerStore((s) => s.removeTracker);
  const { connect, disconnect, ring, stopRing, refreshStatus } = useTrackerConnection();

  const connectionState = liveState?.connectionState ?? 'disconnected';
  const isConnected = connectionState === 'connected';

  useEffect(() => {
    if (!isConnected) {
      connect(trackerId);
    }
    return () => {
      if (isConnected) {
        disconnect(trackerId);
      }
    };
  }, [trackerId]);

  const handleUnpair = () => {
    Alert.alert(
      'Unpair Tracker',
      `Remove "${tracker?.customName}" from your devices?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: () => {
            disconnect(trackerId);
            removeTracker(trackerId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!tracker) {
    return (
      <ScreenShell title="Tracker" showBack>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
            Tracker not found.
          </Text>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title={tracker.customName}
      showBack
      rightAction={
        <TouchableOpacity
          onPress={() => navigation.navigate('RenameTracker', { trackerId })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="pencil-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      }
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.base,
          paddingBottom: insets.bottom + spacing['3xl'],
          gap: spacing.base,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <Card elevated>
          <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: radius.xl,
                backgroundColor: `${colors.primary}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Icon name="radio" size={36} color={colors.primary} />
            </View>
            <Text style={[typography.headingLarge, { color: colors.textPrimary }]}>
              {tracker.customName}
            </Text>
            <View style={{ marginTop: spacing.sm }}>
              <StatusBadge state={connectionState} />
            </View>
            {liveState?.error && (
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.error, marginTop: spacing.sm, textAlign: 'center' },
                ]}
              >
                {liveState.error}
              </Text>
            )}
          </View>
        </Card>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            label={liveState?.isRinging ? 'Ringing...' : 'Ring'}
            onPress={() => (liveState?.isRinging ? stopRing(trackerId) : ring(trackerId))}
            loading={liveState?.isRingLoading}
            disabled={!isConnected}
            variant={liveState?.isRinging ? 'danger' : 'primary'}
            style={{ flex: 1 }}
          />
          <Button
            label="Find"
            onPress={() => navigation.navigate('FindTracker', { trackerId })}
            disabled={!isConnected}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <Button
            label="Refresh"
            onPress={() => refreshStatus(trackerId)}
            disabled={!isConnected}
            variant="secondary"
            style={{ flex: 1 }}
          />
        </View>

        {/* Device info */}
        <Card>
          <Text
            style={[
              typography.labelSmall,
              {
                color: colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Device Info
          </Text>
          <InfoRow label="Battery" value={liveState?.batteryLevel !== null ? `${liveState?.batteryLevel}%` : null} />
          <InfoRow label="RSSI" value={liveState?.rssi !== null ? `${liveState?.rssi} dBm` : null} />
          <InfoRow label="Firmware" value={liveState?.firmwareVersion} />
          <InfoRow label="Hardware" value={liveState?.hardwareRevision} />
          <InfoRow label="Manufacturer" value={liveState?.manufacturerName} />
          <InfoRow
            label="Last seen"
            value={
              tracker.metadata.lastSeen
                ? new Date(tracker.metadata.lastSeen).toLocaleString()
                : null
            }
          />
          <InfoRow
            label="Paired"
            value={new Date(tracker.pairedAt).toLocaleDateString()}
          />
        </Card>

        {/* Firmware update */}
        <TouchableOpacity
          onPress={() => navigation.navigate('OTAUpdate', { trackerId })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundCard,
            borderRadius: radius.xl,
            padding: spacing.base,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Icon name="cloud-download-outline" size={20} color={colors.primary} />
          <Text
            style={[
              typography.labelLarge,
              { color: colors.textPrimary, flex: 1, marginLeft: spacing.md },
            ]}
          >
            Firmware Update
          </Text>
          <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Danger zone */}
        <Button
          label="Unpair Tracker"
          onPress={handleUnpair}
          variant="danger"
          fullWidth
        />
      </ScrollView>
    </ScreenShell>
  );
};
