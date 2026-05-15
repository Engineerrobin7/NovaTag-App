import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@theme/index';
import { RootNavigator } from '@navigation/RootNavigator';
import { useTrackerStore } from '@store/trackerStore';
import { useSettingsStore } from '@store/settingsStore';

const AppContent: React.FC = () => {
  const loadSavedTrackers = useTrackerStore((s) => s.loadSavedTrackers);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
    loadSavedTrackers();
  }, []);

  return <RootNavigator />;
};

export const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
