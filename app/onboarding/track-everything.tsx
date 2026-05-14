import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing 
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackEverythingScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withTiming(0, { 
      duration: 800, 
      easing: Easing.bezier(0.22, 1, 0.36, 1) 
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-8 pt-12 pb-8 justify-between">
        <Animated.View style={animatedStyle}>
          <Text className="text-black text-4xl font-bold tracking-tight leading-tight">
            Track everything{"\n"}that matters.
          </Text>
          <Text className="text-gray-500 text-lg mt-4 leading-7">
            From keys and luggage to pets and people, NovaTag gives you a single elegant view of your world.
          </Text>
        </Animated.View>

        <Animated.View style={animatedStyle} className="items-center">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2067&auto=format&fit=crop" }} 
            className="w-full h-64 rounded-3xl"
            resizeMode="cover"
          />
        </Animated.View>

        <View>
          <Pressable 
            onPress={() => router.push("/onboarding/peace-of-mind")}
            className="bg-primary py-5 rounded-2xl items-center active:bg-primary/90"
          >
            <Text className="text-white font-semibold text-lg">Continue</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push("/sign-in")}
            className="mt-4 py-2 items-center"
          >
            <Text className="text-gray-400">Skip onboarding</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
