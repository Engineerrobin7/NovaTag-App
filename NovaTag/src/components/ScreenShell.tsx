import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';

interface ScreenShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
}

export const ScreenShell: React.FC<ScreenShellProps> = ({
  children,
  title,
  showBack = false,
  rightAction,
  style,
  contentStyle,
}) => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={colors === colors ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      {(title || showBack || rightAction) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.md,
            minHeight: 56,
          }}
        >
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ marginRight: spacing.sm }}
            >
              <Icon
                name="chevron-back"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {title && (
            <Text
              style={[
                typography.headingSmall,
                { color: colors.textPrimary, flex: 1 },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}

          {rightAction && (
            <View style={{ marginLeft: 'auto' }}>{rightAction}</View>
          )}
        </View>
      )}

      {/* Content */}
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
    </View>
  );
};
