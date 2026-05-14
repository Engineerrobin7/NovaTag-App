import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeIn,
  FadeInDown,
  withSpring
} from "react-native-reanimated";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";

export default function PairingScreen() {
  const router = useRouter();
  const addDevice = useDeviceStore((state) => state.addDevice);
  const showToast = useToastStore((state) => state.show);
  
  const [step, setStep] = useState(1); // 1: Found, 2: Naming, 3: Connecting
  const [name, setName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }, { scale: pulse.value }],
  }));

  const handleConnect = async () => {
    setIsConnecting(true);
    setStep(3);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate connection time
      
      const newDevice = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        battery: 100,
        status: "Nearby" as const,
        lastSeen: "Just now",
        icon: "broadcast",
        color: "bg-primary",
        lat: 51.5074,
        lng: -0.1278,
        firmware: "2.1.0",
        safeZones: []
      };

      addDevice(newDevice as any);
      showToast(`${name} paired successfully!`, "success");
      router.replace("/pairing-success");
    } catch (error: any) {
      showToast("Pairing failed. Try again.", "error");
      setStep(2);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-10 justify-center items-center">
            {step === 1 && (
              <Animated.View entering={FadeInDown} className="items-center w-full">
                <Animated.View style={animatedLogoStyle} className="w-48 h-48 rounded-[56px] bg-primary shadow-2xl shadow-primary/30 items-center justify-center">
                  <MaterialCommunityIcons name="broadcast" size={90} color="white" />
                </Animated.View>
                
                <Text className="text-black text-4xl font-bold mt-12 text-center">Tag Found</Text>
                <Text className="text-gray-400 text-lg mt-3 text-center leading-6">
                  A new NovaTag has been detected nearby. Ready to pair?
                </Text>

                <Pressable 
                  onPress={() => setStep(2)}
                  className="bg-primary w-full py-5 rounded-[24px] items-center mt-12 shadow-lg shadow-primary/20 active:bg-primary/90"
                >
                  <Text className="text-white font-bold text-lg">Pair Now</Text>
                </Pressable>
                
                <Pressable onPress={() => router.back()} className="mt-6">
                  <Text className="text-gray-400 font-bold">Not Now</Text>
                </Pressable>
              </Animated.View>
            )}

            {step === 2 && (
              <Animated.View entering={FadeInDown} className="w-full">
                <Text className="text-black text-4xl font-bold">Name It</Text>
                <Text className="text-gray-400 text-lg mt-3 mb-10 leading-6">
                  What are you tracking with this tag?
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. My Backpack"
                  className="bg-gray-50 p-6 rounded-[24px] text-xl text-black border border-gray-100"
                  autoFocus
                />

                <View className="flex-row flex-wrap mt-8">
                  {["Keys", "Backpack", "Wallet", "Bike", "Pet"].map((preset) => (
                    <Pressable 
                      key={preset}
                      onPress={() => setName(preset)}
                      className={`px-5 py-3 rounded-2xl mr-3 mb-3 border ${name === preset ? "bg-primary border-primary" : "bg-white border-gray-100"}`}
                    >
                      <Text className={`font-bold ${name === preset ? "text-white" : "text-gray-400"}`}>{preset}</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable 
                  onPress={handleConnect}
                  disabled={!name || isConnecting}
                  className={`w-full py-5 rounded-[24px] items-center mt-12 shadow-lg ${name ? "bg-black" : "bg-gray-100"}`}
                >
                  <Text className={`font-bold text-lg ${name ? "text-white" : "text-gray-300"}`}>Continue</Text>
                </Pressable>
              </Animated.View>
            )}

            {step === 3 && (
              <Animated.View entering={FadeIn} className="items-center">
                <View className="w-32 h-32 items-center justify-center">
                  <ActivityIndicator size="large" color="#0066cc" />
                </View>
                <Text className="text-black text-2xl font-bold mt-8">Registering {name}...</Text>
                <Text className="text-gray-400 text-lg mt-2">Securing your connection</Text>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
