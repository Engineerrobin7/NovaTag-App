import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { storageService } from '@services/storage/storageService';
import { STORAGE_KEYS } from '@constants/app';
import type { RootStackParamList } from '@/types/navigation';

// Screens
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { ScanScreen } from '@features/tracker/screens/ScanScreen';
import { TrackerDetailScreen } from '@features/tracker/screens/TrackerDetailScreen';
import { FindTrackerScreen } from '@features/tracker/screens/FindTrackerScreen';
import { RenameTrackerScreen } from '@features/tracker/screens/RenameTrackerScreen';
import { OTAUpdateScreen } from '@features/tracker/screens/OTAUpdateScreen';
import { DebugScreen } from '@features/debug/screens/DebugScreen';
import { useTheme } from '@theme/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const onboardingComplete = storageService.getBoolean(
    STORAGE_KEYS.ONBOARDING_COMPLETE,
  );

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.backgroundCard,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName={onboardingComplete ? 'Main' : 'Onboarding'}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="TrackerDetail"
          component={TrackerDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FindTracker"
          component={FindTrackerScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RenameTracker"
          component={RenameTrackerScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen
          name="OTAUpdate"
          component={OTAUpdateScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Debug"
          component={DebugScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
