import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { ScreenShell } from '@components/ScreenShell';
import { Button } from '@components/Button';
import type { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'RenameTracker'>;

export const RenameTrackerScreen: React.FC<Props> = () => {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<Props['route']>();
  const { trackerId } = route.params;

  const tracker = useTrackerStore((s) =>
    s.savedTrackers.find((t) => t.id === trackerId),
  );
  const renameTracker = useTrackerStore((s) => s.renameTracker);

  const [name, setName] = useState(tracker?.customName ?? '');

  const handleSave = () => {
    if (name.trim()) {
      renameTracker(trackerId, name.trim());
    }
    navigation.goBack();
  };

  return (
    <ScreenShell title="Name Your Tracker" showBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing['2xl'],
          }}
        >
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.textSecondary, marginBottom: spacing.xl },
            ]}
          >
            Give your NovaTag a name so you can identify it easily.
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Keys, Backpack, Wallet..."
            placeholderTextColor={colors.textTertiary}
            autoFocus
            maxLength={32}
            style={[
              typography.bodyLarge,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceSecondary,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.base,
                paddingVertical: spacing.md,
                borderWidth: 1,
                borderColor: name ? colors.primary : colors.border,
              },
            ]}
          />

          <Text
            style={[
              typography.caption,
              { color: colors.textTertiary, marginTop: spacing.sm, textAlign: 'right' },
            ]}
          >
            {name.length}/32
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.base,
            gap: spacing.sm,
          }}
        >
          <Button
            label="Save Name"
            onPress={handleSave}
            disabled={!name.trim()}
            fullWidth
            size="lg"
          />
          <Button
            label="Skip"
            onPress={() => navigation.goBack()}
            variant="ghost"
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
};
