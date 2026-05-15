import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@features/onboarding/screens/WelcomeScreen';
import { PermissionsScreen } from '@features/onboarding/screens/PermissionsScreen';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen
      name="Permissions"
      component={PermissionsScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);
