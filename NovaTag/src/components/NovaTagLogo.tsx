import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { useTheme } from '@theme/index';

interface NovaTagLogoProps {
  size?: number;
  showWordmark?: boolean;
}

export const NovaTagLogo: React.FC<NovaTagLogoProps> = ({
  size = 48,
  showWordmark = false,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Geometric logo mark — stylized "N" with signal rings */}
      <Svg width={size} height={size} viewBox="0 0 48 48">
        {/* Outer ring */}
        <Circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.5"
          opacity={0.3}
        />
        {/* Middle ring */}
        <Circle
          cx="24"
          cy="24"
          r="15"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.5"
          opacity={0.6}
        />
        {/* Center dot */}
        <Circle cx="24" cy="24" r="4" fill={colors.primary} />
        {/* N letterform */}
        <Path
          d="M17 32V16l14 16V16"
          stroke={colors.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>

      {showWordmark && (
        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'baseline' }}>
          <Text
            style={[
              typography.headingMedium,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            Nova
          </Text>
          <Text
            style={[
              typography.headingMedium,
              { color: colors.primary, letterSpacing: -0.5 },
            ]}
          >
            Tag
          </Text>
        </View>
      )}
    </View>
  );
};
