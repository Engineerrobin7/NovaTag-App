import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, TextInput, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LostModeScreen() {
  const router = useRouter();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const device = useDeviceStore((state) => state.devices.find(d => d.id === deviceId));
  const toggleLostMode = useDeviceStore((state) => state.toggleLostMode);
  const showToast = useToastStore((state) => state.show);

  const [isLost, setIsLost] = useState(device?.status === "lost");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("If found, please contact me. I've lost my keys.");

  const handleToggle = async (value: boolean) => {
    setIsLost(value);
    try {
      await toggleLostMode(deviceId, value);
      showToast(value ? "Lost Mode Activated" : "Lost Mode Deactivated", value ? "error" : "success");
    } catch (e) {
      showToast("Action failed", "error");
      setIsLost(!value);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 px-8 pt-4" edges={["top"]}>
        <View className="flex-row justify-between items-center mb-10">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <MaterialCommunityIcons name="close" size={28} color="black" />
          </Pressable>
          <Text className="text-black text-xl font-bold">Lost Mode</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-10">
            <View className={`w-24 h-24 rounded-full ${isLost ? "bg-red-500" : "bg-gray-100"} items-center justify-center mb-6`}>
              <MaterialCommunityIcons name="lock-alert" size={48} color={isLost ? "white" : "#ccc"} />
            </View>
            <Text className="text-black text-2xl font-bold text-center">
              {isLost ? "Device is Locked" : "Secure Your Tag"}
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-4 leading-5">
              Lost Mode allows other NovaTag users to anonymously help you find your item.
            </Text>
          </View>

          <View className="bg-gray-50 p-6 rounded-3xl flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-black font-bold text-lg">Enable Lost Mode</Text>
              <Text className="text-gray-400 text-xs">Notify when found & lock settings</Text>
            </View>
            <Switch 
              value={isLost} 
              onValueChange={handleToggle}
              trackColor={{ false: "#eee", true: "#ff3b30" }}
              thumbColor="white"
            />
          </View>

          {isLost && (
            <Animated.View entering={FadeInDown} className="space-y-6">
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-3">Recovery Phone</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 234 567 890"
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100"
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1 mb-3">Custom Message</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell the finder how to help..."
                  multiline
                  numberOfLines={4}
                  className="bg-gray-50 p-5 rounded-2xl text-lg text-black border border-gray-100 h-32"
                  textAlignVertical="top"
                />
              </View>

              <View className="p-4 bg-red-50 rounded-2xl border border-red-100 flex-row">
                <MaterialCommunityIcons name="shield-check" size={20} color="#ff3b30" />
                <Text className="ml-3 text-red-600 text-xs flex-1 leading-4">
                  Once enabled, your tag will advertise a secure ID. When scanned by the NovaTag network, you'll receive a push notification with its location.
                </Text>
              </View>
            </Animated.View>
          )}

          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
