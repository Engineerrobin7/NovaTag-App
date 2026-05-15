import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/index';
import { useTrackerStore } from '@store/trackerStore';
import { useSettingsStore } from '@store/settingsStore';
import { NovaTagLogo } from '@components/NovaTagLogo';
import { EmptyState } from '@components/EmptyState';
import { TrackerCard } from '../components/TrackerCard';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const savedTrackers = useTrackerStore((s) => s.savedTrackers);
  const loadSavedTrackers = useTrackerStore((s) => s.loadSavedTrackers);
  const mockMode = useSettingsStore((s) => s.settings.mockMode);

  useEffect(() => {
    loadSavedTrackers();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
        }}
      >
        <NovaTagLogo size={32} showWordmark />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {mockMode && (
            <View
              style={{
                backgroundColor: `${colors.warning}20`,
                paddingHorizontal: spacing.sm,
                paddingVertical: 3,
                borderRadius: 6,
              }}
            >
              <Text style={[typography.caption, { color: colors.warning, fontWeight: '600' }]}>
                MOCK
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Scan')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tracker list */}
      {savedTrackers.length === 0 ? (
        <EmptyState
          title="No trackers yet"
          description="Pair your first NovaTag to start tracking what matters to you."
          actionLabel="Pair a NovaTag"
          onAction={() => navigation.navigate('Scan')}
        />
      ) : (
        <FlatList
          data={savedTrackers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.base,
            paddingBottom: insets.bottom + spacing['3xl'],
            gap: spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              style={[
                typography.labelSmall,
                {
                  color: colors.textTertiary,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: spacing.xs,
                  marginTop: spacing.xs,
                },
              ]}
            >
              {savedTrackers.length} {savedTrackers.length === 1 ? 'Tracker' : 'Trackers'}
            </Text>
          }
          renderItem={({ item }) => (
            <TrackerCard
              tracker={item}
              onPress={() =>
                navigation.navigate('TrackerDetail', { trackerId: item.id })
              }
            />
          )}
        />
      )}
    </View>
  );
};
