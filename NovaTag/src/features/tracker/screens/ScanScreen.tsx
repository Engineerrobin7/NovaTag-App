import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@theme/index';
import { useDeviceScanner } from '@hooks/useDeviceScanner';
import { useTrackerStore } from '@store/trackerStore';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import type { ScannedDevice } from '@/types/tracker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ScanningRings: React.FC<{ color: string }> = ({ color }) => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity1 = useSharedValue(0.6);
  const opacity2 = useSharedValue(0.4);

  useEffect(() => {
    scale1.value = withRepeat(withTiming(2.2, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false);
    opacity1.value = withRepeat(withTiming(0, { duration: 1800 }), -1, false);
    scale2.value = withRepeat(withTiming(2.2, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false);
    opacity2.value = withRepeat(withTiming(0, { duration: 1800 }), -1, false);
    // Offset second ring
    setTimeout(() => {
      scale2.value = withRepeat(withTiming(2.2, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false);
    }, 600);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  return (
    <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: color,
          },
          ring1Style,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: color,
          },
          ring2Style,
        ]}
      />
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: `${color}20`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="radio" size={36} color={color} />
      </View>
    </View>
  );
};

const DeviceRow: React.FC<{
  device: ScannedDevice;
  onPair: (device: ScannedDevice) => void;
}> = ({ device, onPair }) => {
  const { colors, typography, spacing, radius } = useTheme();

  const rssiLabel =
    device.rssi !== null
      ? device.rssi > -60
        ? 'Strong'
        : device.rssi > -75
        ? 'Good'
        : 'Weak'
      : '—';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${colors.primary}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon name="radio" size={20} color={colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[typography.labelLarge, { color: colors.textPrimary }]}>
          {device.name ?? 'Unknown NovaTag'}
        </Text>
        <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}>
          {device.rssi} dBm · {rssiLabel}
        </Text>
      </View>

      {device.isAlreadyPaired ? (
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: `${colors.success}15`,
          }}
        >
          <Text style={[typography.labelSmall, { color: colors.success }]}>Paired</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onPair(device)}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: 8,
            borderRadius: radius.md,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={[typography.labelMedium, { color: '#fff' }]}>Pair</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const ScanScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { isScanning, scannedDevices, scanError, startScan, stopScan } = useDeviceScanner();
  const addTracker = useTrackerStore((s) => s.addTracker);

  useEffect(() => {
    startScan();
    return () => stopScan();
  }, []);

  const handlePair = (device: ScannedDevice) => {
    const now = new Date().toISOString();
    addTracker({
      id: device.id,
      advertisedName: device.name ?? 'NovaTag',
      customName: device.name ?? 'NovaTag',
      pairedAt: now,
      metadata: {
        customName: device.name ?? 'NovaTag',
        lastConnected: null,
        lastDisconnected: null,
        lastRssi: device.rssi,
        lastSeen: now,
      },
    });
    navigation.navigate('RenameTracker', { trackerId: device.id });
  };

  return (
    <ScreenShell
      title="Add NovaTag"
      showBack
      style={{ paddingBottom: insets.bottom }}
    >
      {/* Scanning animation */}
      <View style={{ alignItems: 'center', paddingVertical: spacing['3xl'] }}>
        {isScanning ? (
          <ScanningRings color={colors.primary} />
        ) : (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="radio-outline" size={36} color={colors.textTertiary} />
          </View>
        )}

        <Text
          style={[
            typography.headingSmall,
            { color: colors.textPrimary, marginTop: spacing.xl, textAlign: 'center' },
          ]}
        >
          {isScanning ? 'Scanning for NovaTag...' : 'Scan complete'}
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
          ]}
        >
          {isScanning
            ? 'Make sure your NovaTag is nearby and powered on.'
            : `Found ${scannedDevices.length} device${scannedDevices.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Error */}
      {scanError && (
        <View
          style={{
            marginHorizontal: spacing.base,
            padding: spacing.md,
            backgroundColor: `${colors.error}15`,
            borderRadius: 12,
            marginBottom: spacing.base,
          }}
        >
          <Text style={[typography.bodySmall, { color: colors.error }]}>
            {scanError}
          </Text>
        </View>
      )}

      {/* Device list */}
      <FlatList
        data={scannedDevices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.base }}
        renderItem={({ item }) => (
          <DeviceRow device={item} onPair={handlePair} />
        )}
        ListEmptyComponent={
          !isScanning ? (
            <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
              <Text style={[typography.bodyMedium, { color: colors.textTertiary }]}>
                No NovaTag devices found nearby.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Rescan button */}
      {!isScanning && (
        <View style={{ padding: spacing.base }}>
          <Button label="Scan Again" onPress={startScan} fullWidth variant="secondary" />
        </View>
      )}
    </ScreenShell>
  );
};
