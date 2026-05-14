import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing,
  runOnJS
} from "react-native-reanimated";
import { Canvas, Circle, BlurMask, vec, LinearGradient } from "@shopify/react-native-skia";
import { colors } from "@theme/colors";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { 
      duration: 1200, 
      easing: Easing.bezier(0.22, 1, 0.36, 1) 
    });
    logoScale.value = withTiming(1, { 
      duration: 1200, 
      easing: Easing.bezier(0.22, 1, 0.36, 1) 
    });
    textOpacity.value = withDelay(600, withTiming(1, { 
      duration: 1000, 
      easing: Easing.bezier(0.22, 1, 0.36, 1) 
    }, () => {
      runOnJS(navigateToWelcome)();
    }));
  }, []);

  const navigateToWelcome = () => {
    setTimeout(() => {
      router.replace("/welcome");
    }, 1500);
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <StatusBar style="light" />
      
      {/* Ambient Glow with Skia */}
      <View className="absolute inset-0">
        <Canvas style={{ flex: 1 }}>
          <Circle cx={width / 2} cy={height / 2} r={150}>
            <BlurMask blur={80} style="normal" />
            <LinearGradient
              start={vec(width / 2 - 150, height / 2 - 150)}
              end={vec(width / 2 + 150, height / 2 + 150)}
              colors={["rgba(0, 102, 204, 0.15)", "rgba(0, 0, 0, 0)"]}
            />
          </Circle>
        </Canvas>
      </View>

      <Animated.View style={logoStyle} className="items-center">
        <Animated.Text 
          className="text-white text-6xl font-extrabold tracking-tighter"
          style={{ fontFamily: "System" }}
        >
          NOVATAG
        </Animated.Text>
        <Animated.View style={textStyle}>
          <Animated.Text 
            className="text-white/60 mt-4 text-lg tracking-wide uppercase"
            style={{ fontFamily: "System" }}
          >
            Premium Tracking Ecosystem
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
