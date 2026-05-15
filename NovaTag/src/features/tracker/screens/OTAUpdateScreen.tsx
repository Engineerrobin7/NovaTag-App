/**
 * OTA Firmware Update Screen
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER — Nordic DFU not implemented in V1.
 * Architecture is ready for react-native-nordic-dfu integration.
 *
 * To implement:
 * 1. Install react-native-nordic-dfu
 * 2. Replace the placeholder UI with actual DFU progress
 * 3. Source firmware .zip from your update server
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import type { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'OTAUpdate'>;

export const OTAUpdateScreen: React.FC<Props> = () => {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const { trackerId } = route.params;

  const tracker = useTrackerStore((s) =>
    s.savedTrackers.find((t) => t.id === trackerId),
  );
  const liveState = useTrackerStore((s) => s.liveStates[trackerId]);

  return (
    <ScreenShell
      title="Firmware Update"
      showBack
      style={{ paddingBottom: insets.bottom }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.base,
          paddingTop: spacing.xl,
          gap: spacing.base,
        }}
      >
        {/* Status card */}
        <Card>
          <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.xl,
                backgroundColor: `${colors.primary}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Icon name="cloud-download-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[typography.headingSmall, { color: colors.textPrimary }]}>
              {tracker?.customName ?? 'NovaTag'}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.textSecondary, marginTop: spacing.xs },
              ]}
            >
              Current firmware: {liveState?.firmwareVersion ?? 'Unknown'}
            </Text>
          </View>
        </Card>

        {/* Coming soon notice */}
        <View
          style={{
            backgroundColor: `${colors.info}12`,
            borderRadius: radius.lg,
            padding: spacing.base,
            borderWidth: 1,
            borderColor: `${colors.info}30`,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: spacing.sm,
          }}
        >
          <Icon name="information-circle-outline" size={20} color={colors.info} style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.labelMedium, { color: colors.info, marginBottom: 4 }]}>
              OTA Updates Coming Soon
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary, lineHeight: 18 }]}>
              Over-the-air firmware updates via Nordic DFU will be available in a future release.
              Your device firmware is managed by InfyNova.
            </Text>
          </View>
        </View>

        {/* Architecture note for developers */}
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
            Developer Note
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, lineHeight: 18 }]}>
            To implement DFU:{'\n'}
            1. Install react-native-nordic-dfu{'\n'}
            2. Source firmware .zip from update server{'\n'}
            3. Call NordicDFU.startDFU() with device ID{'\n'}
            4. Monitor progress via DFU callbacks
          </Text>
        </Card>
      </View>
    </ScreenShell>
  );
};
