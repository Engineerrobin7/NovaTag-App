import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
  Extrapolate,
  FadeInDown
} from "react-native-reanimated";
import { Canvas, Circle, BlurMask } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function SOSScreen() {
  const router = useRouter();
  const [triggered, setTriggered] = useState(false);
  const holdProgress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    holdProgress.value = withTiming(1, { duration: 3000 }, (finished) => {
      if (finished) {
        runOnJS(setTriggered)(true);
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
      }
    });
  };

  const handlePressOut = () => {
    if (!triggered) {
      holdProgress.value = withTiming(0, { duration: 500 });
    }
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(holdProgress.value, [0, 1], [1, 1.2]) }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: holdProgress.value > 0 ? 1 : 0,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: triggered ? 0 : 0.3,
  }));

  return (
    <View className={`flex-1 ${triggered ? "bg-red-600" : "bg-black"}`}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-white font-bold text-lg">Emergency SOS</Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 items-center justify-center px-8">
          {!triggered ? (
            <>
              <Animated.View style={pulseStyle} className="absolute">
                <View className="w-80 h-80 rounded-full border-2 border-red-500/50" />
              </Animated.View>

              <View className="items-center justify-center">
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Animated.View 
                    style={buttonStyle}
                    className="w-64 h-64 rounded-full bg-red-600 items-center justify-center shadow-2xl shadow-red-600/50"
                  >
                    <Text className="text-white text-5xl font-black italic">SOS</Text>
                  </Animated.View>
                </Pressable>
                
                {/* Progress Indicator */}
                <Animated.View style={progressStyle} className="mt-8 items-center">
                  <Text className="text-white font-bold text-xl uppercase tracking-widest">Hold to activate</Text>
                  <View className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <Animated.View 
                      style={useAnimatedStyle(() => ({
                        width: `${holdProgress.value * 100}%`,
                        backgroundColor: "white",
                        height: "100%",
                      }))}
                    />
                  </View>
                </Animated.View>
              </View>

              <Text className="text-white/40 text-center mt-20 leading-6">
                Holding the SOS button will share your precise location with emergency services and your primary contacts.
              </Text>
            </>
          ) : (
            <Animated.View entering={FadeInDown} className="items-center">
              <MaterialCommunityIcons name="alert-decagram" size={120} color="white" />
              <Text className="text-white text-4xl font-black mt-8 text-center uppercase tracking-tighter">Emergency{"\n"}Activated</Text>
              <Text className="text-white/80 text-xl mt-6 text-center leading-7">
                Your location is being shared. Help is on the way.
              </Text>
              
              <Pressable 
                onPress={() => setTriggered(false)}
                className="mt-16 bg-white px-10 py-5 rounded-2xl"
              >
                <Text className="text-red-600 font-bold text-lg">Cancel Emergency</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>

        {/* Contact List */}
        {!triggered && (
          <View className="px-8 pb-12">
            <Text className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Emergency Contacts</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                <MaterialCommunityIcons name="account-alert-outline" size={24} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-white font-bold">Sarah Johnson</Text>
                <Text className="text-white/40 text-sm">Primary Contact</Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
