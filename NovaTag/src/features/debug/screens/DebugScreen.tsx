/**
 * BLE Debug / Diagnostics Screen
 * Hidden behind Settings > BLE Debug Mode toggle.
 * For hardware bring-up and firmware testing.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { getActiveBleService } from '@services/ble/bleProvider';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import type { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'Debug'>;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

export const DebugScreen: React.FC<Props> = () => {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const { trackerId } = route.params;

  const savedTrackers = useTrackerStore((s) => s.savedTrackers);
  const liveStates = useTrackerStore((s) => s.liveStates);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [serviceUUID, setServiceUUID] = useState('');
  const [charUUID, setCharUUID] = useState('');
  const [writeValue, setWriteValue] = useState('');
  const [selectedTrackerId, setSelectedTrackerId] = useState(trackerId ?? '');

  const log = useCallback(
    (message: string, level: LogEntry['level'] = 'info') => {
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
        },
        ...prev.slice(0, 99), // Keep last 100 entries
      ]);
    },
    [],
  );

  const handleDiscoverServices = async () => {
    if (!selectedTrackerId) return;
    try {
      log(`Discovering services for ${selectedTrackerId}...`);
      const services = await getActiveBleService().discoverServices(selectedTrackerId);
      services.forEach((s) => log(`  Service: ${s}`, 'success'));
      log(`Found ${services.length} services`, 'success');
    } catch (e: unknown) {
      log(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const handleDiscoverCharacteristics = async () => {
    if (!selectedTrackerId || !serviceUUID) return;
    try {
      log(`Discovering characteristics for service ${serviceUUID}...`);
      const chars = await getActiveBleService().discoverCharacteristics(
        selectedTrackerId,
        serviceUUID,
      );
      chars.forEach((c) => log(`  Characteristic: ${c}`, 'success'));
    } catch (e: unknown) {
      log(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const handleRead = async () => {
    if (!selectedTrackerId || !serviceUUID || !charUUID) return;
    try {
      log(`Reading ${charUUID}...`);
      const value = await getActiveBleService().readCharacteristic(
        selectedTrackerId,
        serviceUUID,
        charUUID,
      );
      log(`Value (base64): ${value}`, 'success');
      if (value) {
        try {
          const decoded = Buffer.from(value, 'base64').toString('utf-8');
          log(`Decoded (UTF-8): ${decoded}`, 'info');
        } catch {}
      }
    } catch (e: unknown) {
      log(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const handleWrite = async () => {
    if (!selectedTrackerId || !serviceUUID || !charUUID || !writeValue) return;
    try {
      log(`Writing "${writeValue}" to ${charUUID}...`);
      await getActiveBleService().writeCharacteristic(
        selectedTrackerId,
        serviceUUID,
        charUUID,
        writeValue,
      );
      log('Write successful', 'success');
    } catch (e: unknown) {
      log(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const logColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warn': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScreenShell title="BLE Diagnostics" showBack>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.base,
          paddingBottom: insets.bottom + spacing['3xl'],
          gap: spacing.base,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Device selector */}
        <Card>
          <Text style={[typography.labelSmall, { color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm }]}>
            Target Device
          </Text>
          {savedTrackers.map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setSelectedTrackerId(t.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                gap: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: selectedTrackerId === t.id ? colors.primary : colors.border,
                  backgroundColor: selectedTrackerId === t.id ? colors.primary : 'transparent',
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[typography.labelMedium, { color: colors.textPrimary }]}>
                  {t.customName}
                </Text>
                <Text style={[typography.mono, { color: colors.textTertiary, fontSize: 10 }]}>
                  {t.id}
                </Text>
              </View>
              <Text style={[typography.caption, { color: liveStates[t.id]?.connectionState === 'connected' ? colors.success : colors.textTertiary }]}>
                {liveStates[t.id]?.connectionState ?? 'disconnected'}
              </Text>
            </TouchableOpacity>
          ))}
          {savedTrackers.length === 0 && (
            <Text style={[typography.bodySmall, { color: colors.textTertiary }]}>
              No saved trackers. Pair a device first.
            </Text>
          )}
        </Card>

        {/* UUID inputs */}
        <Card>
          <Text style={[typography.labelSmall, { color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm }]}>
            Service / Characteristic
          </Text>
          <TextInput
            value={serviceUUID}
            onChangeText={setServiceUUID}
            placeholder="Service UUID"
            placeholderTextColor={colors.textTertiary}
            style={[
              typography.mono,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceSecondary,
                borderRadius: radius.md,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                fontSize: 12,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            value={charUUID}
            onChangeText={setCharUUID}
            placeholder="Characteristic UUID"
            placeholderTextColor={colors.textTertiary}
            style={[
              typography.mono,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceSecondary,
                borderRadius: radius.md,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                fontSize: 12,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            value={writeValue}
            onChangeText={setWriteValue}
            placeholder="Write value (base64)"
            placeholderTextColor={colors.textTertiary}
            style={[
              typography.mono,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceSecondary,
                borderRadius: radius.md,
                padding: spacing.sm,
                fontSize: 12,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Card>

        {/* Actions */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Button label="Discover Services" onPress={handleDiscoverServices} size="sm" variant="secondary" />
          <Button label="Discover Chars" onPress={handleDiscoverCharacteristics} size="sm" variant="secondary" />
          <Button label="Read" onPress={handleRead} size="sm" variant="secondary" />
          <Button label="Write" onPress={handleWrite} size="sm" />
          <Button label="Clear Log" onPress={() => setLogs([])} size="sm" variant="ghost" />
        </View>

        {/* Log output */}
        <Card>
          <Text style={[typography.labelSmall, { color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm }]}>
            Log ({logs.length})
          </Text>
          {logs.length === 0 ? (
            <Text style={[typography.mono, { color: colors.textTertiary, fontSize: 12 }]}>
              No log entries yet.
            </Text>
          ) : (
            logs.map((entry) => (
              <View key={entry.id} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={[typography.mono, { color: colors.textTertiary, fontSize: 10, marginRight: spacing.sm, minWidth: 60 }]}>
                  {entry.timestamp}
                </Text>
                <Text style={[typography.mono, { color: logColor(entry.level), fontSize: 11, flex: 1 }]}>
                  {entry.message}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </ScreenShell>
  );
};
