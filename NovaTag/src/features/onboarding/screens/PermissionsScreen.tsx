import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { Button } from '@components/Button';
import { useBlePermissions } from '@hooks/useBlePermissions';
import { storageService } from '@services/storage/storageService';
import { STORAGE_KEYS } from '@constants/app';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Permissions'>;

const PermissionRow: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const { colors, typography, spacing, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: `${colors.primary}18`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.labelLarge, { color: colors.textPrimary, marginBottom: 2 }]}>
          {title}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, lineHeight: 18 }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { requestPermissions, isBlocked, openAppSettings } = useBlePermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllow = async () => {
    setLoading(true);
    setError(null);
    const granted = await requestPermissions();
    setLoading(false);

    if (granted) {
      storageService.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
      navigation.getParent()?.navigate('Main');
    } else if (isBlocked) {
      setError('Bluetooth permission is blocked. Please enable it in Settings.');
    } else {
      setError('Bluetooth permission is required to use NovaTag.');
    }
  };

  const handleSkip = () => {
    storageService.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    navigation.getParent()?.navigate('Main');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + spacing.base,
        paddingHorizontal: spacing.xl,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={[
            typography.displaySmall,
            { color: colors.textPrimary, marginBottom: spacing.sm },
          ]}
        >
          A few permissions
        </Text>
        <Text
          style={[
            typography.bodyLarge,
            {
              color: colors.textSecondary,
              marginBottom: spacing['3xl'],
              lineHeight: 26,
            },
          ]}
        >
          NovaTag needs these to find and connect to your trackers.
        </Text>

        <PermissionRow
          icon="bluetooth"
          title="Bluetooth"
          description="Required to scan for and connect to NovaTag devices nearby."
        />

        {Platform.OS === 'android' && (
          <PermissionRow
            icon="location-outline"
            title="Location (Android)"
            description="Android requires location permission for Bluetooth scanning. NovaTag does not store your location."
          />
        )}

        <PermissionRow
          icon="notifications-outline"
          title="Notifications (optional)"
          description="Get alerted when a tracker goes out of range or is found."
        />

        {error && (
          <View
            style={{
              backgroundColor: `${colors.error}15`,
              borderRadius: 12,
              padding: spacing.md,
              marginTop: spacing.base,
            }}
          >
            <Text style={[typography.bodySmall, { color: colors.error }]}>
              {error}
            </Text>
          </View>
        )}
      </View>

      <View style={{ gap: spacing.sm }}>
        {isBlocked ? (
          <Button
            label="Open Settings"
            onPress={openAppSettings}
            fullWidth
            size="lg"
          />
        ) : (
          <Button
            label="Allow Permissions"
            onPress={handleAllow}
            loading={loading}
            fullWidth
            size="lg"
          />
        )}
        <Button
          label="Skip for now"
          onPress={handleSkip}
          variant="ghost"
          fullWidth
          size="md"
        />
      </View>
    </View>
  );
};
