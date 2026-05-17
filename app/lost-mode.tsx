import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, TextInput, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDeviceStore } from "@store/useDeviceStore";
import { useToastStore } from "@store/useToastStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { database } from "../services/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import nacl from "tweetnacl";

export default function LostModeScreen() {
  const router = useRouter();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const device = useDeviceStore((state) => state.devices.find(d => d.id === deviceId));
  const toggleLostMode = useDeviceStore((state) => state.toggleLostMode);
  const showToast = useToastStore((state) => state.show);

  const [isLost, setIsLost] = useState(device?.status === "lost");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("If found, please contact me. I've lost my keys.");
  const [foundLocation, setFoundLocation] = useState<{latitude: number, longitude: number} | null>(null);

  function bytesToString(bytes: Uint8Array) {
    let str = '';
    for (let i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return str;
  }

  useEffect(() => {
    if (isLost && deviceId) {
      const fetchLocation = async () => {
        try {
          const q = query(
            collection(database, "location_reports"),
            where("publicKeyHash", "==", deviceId),
            orderBy("timestamp", "desc"),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0].data();
            const { nonce, ephemeralPublicKey, box } = doc.encryptedData;
            
            // Decrypt
            const mockTagPrivateKey = new Uint8Array(32); // zeros
            
            const nonceBytes = new Uint8Array(nonce);
            const pubKeyBytes = new Uint8Array(ephemeralPublicKey);
            const boxBytes = new Uint8Array(box);
            
            const decrypted = nacl.box.open(boxBytes, nonceBytes, pubKeyBytes, mockTagPrivateKey);
            
            if (decrypted) {
              const locationStr = bytesToString(decrypted);
              const location = JSON.parse(locationStr);
              setFoundLocation(location);
            }
          }
        } catch (e) {
          console.error("Error fetching location:", e);
        }
      };
      fetchLocation();
    }
  }, [isLost, deviceId]);

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
    <View className="flex-1 bg-[#f7f9fc]"> {/* Material 3 Surface Tone */}
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        
        {/* Header */}
        <View className="px-6 flex-row justify-between items-center h-16">
          <Pressable 
            onPress={() => router.back()} 
            className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
          >
            <MaterialCommunityIcons name="close" size={24} color="#1c1b1f" />
          </Pressable>
          <Text className="text-[#1c1b1f] font-bold text-lg">Lost Mode</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          <View className="items-center mt-6 mb-8">
            <View className={`w-24 h-24 rounded-[32px] ${isLost ? "bg-[#ba1a1a]" : "bg-[#e8f0fe]"} items-center justify-center mb-6 shadow-sm`}>
              <MaterialCommunityIcons name="lock-alert" size={48} color={isLost ? "white" : "#0066cc"} />
            </View>
            <Text className="text-[#1c1b1f] text-2xl font-bold text-center">
              {isLost ? "Device is Locked" : "Secure Your Tag"}
            </Text>
            <Text className="text-[#49454f] text-center mt-2 px-4 leading-5 text-sm">
              Lost Mode allows other NovaTag users to anonymously help you find your item.
            </Text>
          </View>

          {/* Toggle Card - Material 3 Style */}
          <View className="bg-white p-6 rounded-[28px] flex-row items-center justify-between mb-6 shadow-sm">
            <View className="flex-1 mr-4">
              <Text className="text-[#1c1b1f] font-bold text-lg">Enable Lost Mode</Text>
              <Text className="text-[#49454f] text-xs mt-0.5">Notify when found & lock settings</Text>
            </View>
            <Switch 
              value={isLost} 
              onValueChange={handleToggle}
              trackColor={{ false: "#e3e1e6", true: "#ba1a1a" }}
              thumbColor="white"
            />
          </View>

          {isLost && (
            <Animated.View entering={FadeInDown} className="space-y-6">
              
              {/* Found Location Alert */}
              {foundLocation && (
                <View className="p-4 bg-[#e8f0fe] rounded-[24px] border border-[#c2e7ff] flex-row items-center">
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color="#0066cc" />
                  <View className="ml-3 flex-1">
                    <Text className="text-[#0066cc] font-bold">Location Found by Network!</Text>
                    <Text className="text-[#041e49] text-xs mt-0.5">
                      Lat: {foundLocation.latitude.toFixed(4)}, Lng: {foundLocation.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Phone Input */}
              <View className="bg-white p-6 rounded-[28px] shadow-sm">
                <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest mb-3">Recovery Phone</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 234 567 890"
                  className="bg-[#f3f4f9] p-4 rounded-xl text-lg text-[#1c1b1f]"
                  keyboardType="phone-pad"
                  placeholderTextColor="#93909a"
                />
              </View>

              {/* Message Input */}
              <View className="bg-white p-6 rounded-[28px] shadow-sm">
                <Text className="text-[#49454f] text-xs font-bold uppercase tracking-widest mb-3">Custom Message</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell the finder how to help..."
                  multiline
                  numberOfLines={4}
                  className="bg-[#f3f4f9] p-4 rounded-xl text-lg text-[#1c1b1f] h-32"
                  textAlignVertical="top"
                  placeholderTextColor="#93909a"
                />
              </View>

              {/* Security Info Card */}
              <View className="p-5 bg-[#fce8e6] rounded-[28px] border border-[#f9dad7] flex-row">
                <MaterialCommunityIcons name="shield-check" size={20} color="#ba1a1a" />
                <Text className="ml-3 text-[#410002] text-xs flex-1 leading-4 font-medium">
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
