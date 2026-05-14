import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StayInformedScreen() {
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
            Stay informed with{"\n"}smart alerts.
          </Text>
          <Text className="text-gray-500 text-lg mt-4 leading-7">
            NovaTag anticipates what you need and delivers calm, confident notifications that matter.
          </Text>
        </Animated.View>

        <Animated.View style={animatedStyle} className="items-center">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" }} 
            className="w-full h-64 rounded-3xl"
            resizeMode="cover"
          />
        </Animated.View>

        <View>
          <Pressable 
            onPress={() => router.push("/permissions")}
            className="bg-black py-5 rounded-2xl items-center active:bg-black/90"
          >
            <Text className="text-white font-semibold text-lg">Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
