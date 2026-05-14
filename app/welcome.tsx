import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, Dimensions, Pressable } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing 
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { colors } from "@theme/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));
    contentTranslateY.value = withDelay(400, withTiming(0, { 
      duration: 1000, 
      easing: Easing.bezier(0.22, 1, 0.36, 1) 
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Product Hero Image */}
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1620121692029-d088224efc74?q=80&w=2064&auto=format&fit=crop" }} 
        className="absolute inset-0 w-full h-full opacity-80"
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <View className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

      <Animated.View style={animatedStyle} className="flex-1 justify-end px-8 pb-16">
        <Text className="text-white text-5xl font-bold tracking-tight leading-tight">
          Welcome to{"\n"}NovaTag
        </Text>
        <Text className="text-white/70 text-lg mt-4 leading-7">
          A luxury smart tracking ecosystem designed for your peace of mind.
        </Text>

        <View className="mt-12 overflow-hidden rounded-3xl">
          <BlurView intensity={20} tint="light">
            <Pressable 
              onPress={() => router.push("/onboarding/track-everything")}
              className="bg-white py-5 items-center active:bg-white/90"
            >
              <Text className="text-black font-semibold text-lg">Get Started</Text>
            </Pressable>
          </BlurView>
        </View>

        <Pressable 
          onPress={() => router.push("/sign-in")}
          className="mt-6 items-center"
        >
          <Text className="text-white/60 text-base">Already have an account? <Text className="text-white font-medium">Sign In</Text></Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
