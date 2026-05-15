import React, { useEffect } from 'react';
import { View, Text, Animated as RNAnimated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@theme/index';
import { useFindTracker, rssiToProximity } from '@hooks/useFindTracker';
import { useTrackerStore } from '@store/trackerStore';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import type { RootStackScreenProps } from '@/types/navigation';
import type { ProximityLevel } from '@/types/tracker';

type Props = RootStackScreenProps<'FindTracker'>;

const PROXIMITY_CONFIG: Record<
  ProximityLevel,
  { label: string; sublabel: string; color: string; rings: number }
> = {
  very_close: {
    label: 'Very Close',
    sublabel: 'Right here!',
    color: '#00c853',
    rings: 4,
  },
  nearby: {
    label: 'Nearby',
    sublabel: 'Within a few meters',
    color: '#00cccc',
    rings: 3,
  },
  far: {
    label: 'Far',
    sublabel: 'In the same room',
    color: '#ffab00',
    rings: 2,
  },
  weak: {
    label: 'Weak Signal',
    sublabel: 'Getting further away',
    color: '#ff6d00',
    rings: 1,
  },
  disconnected: {
    label: 'Disconnected',
    sublabel: 'Out of range',
    color: '#868e96',
    rings: 0,
  },
};

const RadarMeter: React.FC<{
  proximity: ProximityLevel;
  rssi: number | null;
}> = ({ proximity, rssi }) => {
  const { colors } = useTheme();
  const config = PROXIMITY_CONFIG[proximity];
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (proximity !== 'disconnected') {
      pulse.value = withRepeat(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      pulse.value = 1;
    }
  }, [proximity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const SIZE = 240;
  const CENTER = SIZE / 2;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Background rings */}
        {[1, 2, 3, 4].map((ring) => (
          <Circle
            key={ring}
            cx={CENTER}
            cy={CENTER}
            r={(CENTER - 10) * (ring / 4)}
            fill="none"
            stroke={colors.border}
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Active rings */}
        {Array.from({ length: config.rings }).map((_, i) => (
          <Circle
            key={`active-${i}`}
            cx={CENTER}
            cy={CENTER}
            r={(CENTER - 10) * ((i + 1) / 4)}
            fill={`${config.color}08`}
            stroke={config.color}
            strokeWidth="1.5"
            opacity={0.6 - i * 0.1}
          />
        ))}
      </Svg>

      {/* Center dot */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: `${config.color}20`,
            alignItems: 'center',
            justifyContent: 'center',
          },
          pulseStyle,
        ]}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: config.color,
          }}
        />
      </Animated.View>
    </View>
  );
};

export const FindTrackerScreen: React.FC<Props> = () => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const { trackerId } = route.params;

  const tracker = useTrackerStore((s) =>
    s.savedTrackers.find((t) => t.id === trackerId),
  );
  const { rssi, proximity, isMonitoring, startMonitoring, stopMonitoring } =
    useFindTracker(trackerId);

  const config = PROXIMITY_CONFIG[proximity];

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  return (
    <ScreenShell
      title={`Find ${tracker?.customName ?? 'Tracker'}`}
      showBack
      style={{ paddingBottom: insets.bottom }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <RadarMeter proximity={proximity} rssi={rssi} />

        <View style={{ alignItems: 'center', marginTop: spacing['2xl'] }}>
          <Text
            style={[
              typography.displaySmall,
              { color: config.color, textAlign: 'center' },
            ]}
          >
            {config.label}
          </Text>
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
            ]}
          >
            {config.sublabel}
          </Text>
          {rssi !== null && (
            <Text
              style={[
                typography.mono,
                { color: colors.textTertiary, marginTop: spacing.sm },
              ]}
            >
              {rssi} dBm
            </Text>
          )}
        </View>

        <View style={{ width: '100%', marginTop: spacing['3xl'], gap: spacing.sm }}>
          {!isMonitoring ? (
            <Button label="Start Monitoring" onPress={startMonitoring} fullWidth />
          ) : (
            <Button
              label="Stop Monitoring"
              onPress={stopMonitoring}
              variant="secondary"
              fullWidth
            />
          )}
        </View>
      </View>
    </ScreenShell>
  );
};
