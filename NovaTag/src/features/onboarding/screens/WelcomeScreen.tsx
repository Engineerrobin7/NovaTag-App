import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { useTheme } from '@theme/index';
import { NovaTagLogo } from '@components/NovaTagLogo';
import { Button } from '@components/Button';
import { APP_TAGLINE } from '@constants/app';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Find what matters.',
    subtitle:
      'NovaTag keeps your most important things within reach — always.',
    illustration: 'radar',
  },
  {
    id: '2',
    title: 'Instant proximity.',
    subtitle:
      'Real-time Bluetooth tracking tells you exactly how close your tag is.',
    illustration: 'signal',
  },
  {
    id: '3',
    title: 'Ring on demand.',
    subtitle:
      'Can\'t see it? Make it ring. Find your keys, bag, or anything in seconds.',
    illustration: 'ring',
  },
];

const SlideIllustration: React.FC<{ type: string; color: string }> = ({
  type,
  color,
}) => {
  if (type === 'radar') {
    return (
      <Svg width={160} height={160} viewBox="0 0 160 160">
        <Circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="1" opacity={0.15} />
        <Circle cx="80" cy="80" r="50" fill="none" stroke={color} strokeWidth="1" opacity={0.25} />
        <Circle cx="80" cy="80" r="30" fill="none" stroke={color} strokeWidth="1.5" opacity={0.4} />
        <Circle cx="80" cy="80" r="10" fill={color} opacity={0.8} />
        <Circle cx="80" cy="80" r="5" fill={color} />
        <Circle cx="110" cy="55" r="6" fill={color} opacity={0.9} />
      </Svg>
    );
  }
  if (type === 'signal') {
    return (
      <Svg width={160} height={160} viewBox="0 0 160 160">
        <Path d="M40 120 Q80 40 120 120" fill="none" stroke={color} strokeWidth="2" opacity={0.2} />
        <Path d="M55 120 Q80 60 105 120" fill="none" stroke={color} strokeWidth="2" opacity={0.4} />
        <Path d="M68 120 Q80 78 92 120" fill="none" stroke={color} strokeWidth="2.5" opacity={0.7} />
        <Circle cx="80" cy="120" r="5" fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={160} height={160} viewBox="0 0 160 160">
      <Circle cx="80" cy="80" r="40" fill="none" stroke={color} strokeWidth="2" opacity={0.3} />
      <Circle cx="80" cy="80" r="25" fill={color} opacity={0.15} />
      <Circle cx="80" cy="80" r="12" fill={color} opacity={0.6} />
      <Line x1="80" y1="30" x2="80" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
      <Line x1="80" y1="130" x2="80" y2="140" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
      <Line x1="30" y1="80" x2="20" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
      <Line x1="130" y1="80" x2="140" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
    </Svg>
  );
};

type Props = NativeStackScreenProps<any, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('Permissions');
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + spacing.base,
      }}
    >
      {/* Logo */}
      <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
        <NovaTagLogo size={40} showWordmark />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing['2xl'],
            }}
          >
            <SlideIllustration type={item.illustration} color={colors.primary} />
            <Text
              style={[
                typography.displaySmall,
                {
                  color: colors.textPrimary,
                  textAlign: 'center',
                  marginTop: spacing['2xl'],
                  marginBottom: spacing.md,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                typography.bodyLarge,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 28,
                },
              ]}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: spacing.xl,
        }}
      >
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === activeIndex ? colors.primary : colors.border,
              marginHorizontal: 3,
            }}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Button
          label={isLast ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        {!isLast && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Permissions')}
            style={{ alignItems: 'center', marginTop: spacing.base }}
          >
            <Text style={[typography.labelMedium, { color: colors.textTertiary }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
