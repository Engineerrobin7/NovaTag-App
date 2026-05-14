import React, { useEffect } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS 
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToastStore, ToastType } from "@store/useToastStore";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const TOAST_COLORS = {
  success: "#34c759",
  error: "#ff3b30",
  info: "#0066cc",
  warning: "#ff9500",
};

const TOAST_ICONS: Record<ToastType, any> = {
  success: "check-circle",
  error: "alert-circle",
  info: "information",
  warning: "alert",
};

export const Toast = () => {
  const { visible, message, type, hide } = useToastStore();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(60);
      opacity.value = withTiming(1);
      
      const timer = setTimeout(() => {
        handleHide();
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      handleHide();
    }
  }, [visible]);

  const handleHide = () => {
    translateY.value = withSpring(-100);
    opacity.value = withTiming(0, {}, () => {
      runOnJS(hide)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <Animated.View 
      style={[{ 
        position: "absolute", 
        top: 0, 
        left: 20, 
        right: 20, 
        zIndex: 9999,
        alignItems: "center"
      }, animatedStyle]}
    >
      <Pressable onPress={handleHide} className="w-full max-w-md">
        <View className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <BlurView intensity={80} tint="dark" className="flex-row items-center px-6 py-4">
            <View className="w-8 h-8 rounded-full items-center justify-center mr-4" style={{ backgroundColor: TOAST_COLORS[type] }}>
              <MaterialCommunityIcons name={TOAST_ICONS[type]} size={20} color="white" />
            </View>
            <Text className="text-white font-semibold flex-1 text-sm" numberOfLines={2}>
              {message}
            </Text>
            <MaterialCommunityIcons name="close" size={16} color="rgba(255,255,255,0.4)" />
          </BlurView>
        </View>
      </Pressable>
    </Animated.View>
  );
};
