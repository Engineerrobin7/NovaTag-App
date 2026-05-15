import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useSettingsStore } from '@store/settingsStore';
import { APP_NAME, APP_VERSION, COMPANY_NAME, PRIVACY_POLICY_URL, TERMS_URL } from '@constants/app';
import type { ThemeMode } from '@/types/settings';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { colors, typography, spacing } = useTheme();
  return (
    <Text
      style={[
        typography.labelSmall,
        {
          color: colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          paddingHorizontal: spacing.base,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xs,
        },
      ]}
    >
      {title}
    </Text>
  );
};

const SettingsRow: React.FC<{
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}> = ({ icon, label, value, onPress, rightElement, destructive }) => {
  const { colors, typography, spacing, radius } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.sm,
          backgroundColor: destructive ? `${colors.error}15` : `${colors.primary}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon
          name={icon}
          size={18}
          color={destructive ? colors.error : colors.primary}
        />
      </View>
      <Text
        style={[
          typography.bodyMedium,
          {
            flex: 1,
            color: destructive ? colors.error : colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>
      {value && (
        <Text style={[typography.bodySmall, { color: colors.textTertiary, marginRight: spacing.sm }]}>
          {value}
        </Text>
      )}
      {rightElement}
      {onPress && !rightElement && (
        <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
};

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export const SettingsScreen: React.FC = () => {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { settings, updateSettings } = useSettingsStore();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
        }}
      >
        <Text style={[typography.headingLarge, { color: colors.textPrimary }]}>
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View
          style={{
            backgroundColor: colors.backgroundCard,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ paddingHorizontal: spacing.base, paddingVertical: spacing.md }}>
            <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
              Theme
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {THEME_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => updateSettings({ themeMode: opt.value })}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: radius.md,
                    alignItems: 'center',
                    backgroundColor:
                      settings.themeMode === opt.value
                        ? colors.primary
                        : colors.surfaceSecondary,
                    borderWidth: 1,
                    borderColor:
                      settings.themeMode === opt.value
                        ? colors.primary
                        : colors.border,
                  }}
                >
                  <Text
                    style={[
                      typography.labelMedium,
                      {
                        color:
                          settings.themeMode === opt.value
                            ? '#fff'
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <View
          style={{
            backgroundColor: colors.backgroundCard,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            rightElement={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
                trackColor={{ true: colors.primary }}
              />
            }
          />
          <SettingsRow
            icon="flask-outline"
            label="Mock Mode"
            value={settings.mockMode ? 'On' : 'Off'}
            rightElement={
              <Switch
                value={settings.mockMode}
                onValueChange={(v) => updateSettings({ mockMode: v })}
                trackColor={{ true: colors.warning }}
              />
            }
          />
          <SettingsRow
            icon="bug-outline"
            label="BLE Debug Mode"
            rightElement={
              <Switch
                value={settings.bleDebugMode}
                onValueChange={(v) => updateSettings({ bleDebugMode: v })}
                trackColor={{ true: colors.primary }}
              />
            }
          />
        </View>

        {/* Developer */}
        {settings.bleDebugMode && (
          <>
            <SectionHeader title="Developer" />
            <View
              style={{
                backgroundColor: colors.backgroundCard,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <SettingsRow
                icon="terminal-outline"
                label="BLE Diagnostics"
                onPress={() => navigation.navigate('Debug', {})}
              />
            </View>
          </>
        )}

        {/* About */}
        <SectionHeader title="About" />
        <View
          style={{
            backgroundColor: colors.backgroundCard,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL(TERMS_URL)}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="Version"
            value={`${APP_VERSION}`}
          />
          <SettingsRow
            icon="business-outline"
            label="Made by"
            value={COMPANY_NAME}
          />
        </View>
      </ScrollView>
    </View>
  );
};
