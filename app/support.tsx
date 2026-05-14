import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function SupportScreen() {
  const router = useRouter();

  const faqs = [
    { 
      q: "How do I pair a new NovaTag?", 
      a: "Hold your tag near your phone and follow the 'Add NovaTag' wizard in the app dashboard.",
      icon: "bluetooth-connect"
    },
    { 
      q: "What's the range of NovaTag?", 
      a: "NovaTag typically has a Bluetooth range of 30-50 meters, and uses the global network beyond that.",
      icon: "map-marker-radius"
    },
    { 
      q: "Is NovaTag water resistant?", 
      a: "Yes, every NovaTag is IP67 rated, meaning it's protected against dust and water immersion up to 1 meter.",
      icon: "water-outline"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </Pressable>
          <Text className="text-black font-bold text-lg">Support</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <Text className="text-black text-3xl font-bold mb-2 ml-2">Help Center</Text>
          <Text className="text-gray-400 text-lg mb-8 ml-2 leading-7">
            Everything you need to know about your NovaTag ecosystem.
          </Text>

          {/* Search Bar */}
          <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-4 mb-10">
            <MaterialCommunityIcons name="magnify" size={24} color="#7a7a7a" />
            <TextInput 
              placeholder="Search help articles..."
              className="flex-1 ml-3 text-lg"
              placeholderTextColor="#7a7a7a"
            />
          </View>

          <View className="space-y-8">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Quick Help</Text>
              <CardPanel intensity={10}>
                {faqs.map((faq, index) => (
                  <Pressable 
                    key={index}
                    className="py-4 border-b border-gray-50 last:border-0"
                  >
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name={faq.icon as any} size={20} color="#0066cc" />
                      <Text className="flex-1 ml-4 text-black font-bold text-lg">{faq.q}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#d1d1d6" />
                    </View>
                    <Text className="text-gray-500 mt-2 ml-9 leading-6">{faq.a}</Text>
                  </Pressable>
                ))}
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Contact Us</Text>
              <View className="flex-row space-x-4">
                <Pressable className="flex-1 bg-blue-500 p-6 rounded-[32px] items-center shadow-lg shadow-blue-500/20">
                  <MaterialCommunityIcons name="chat-processing-outline" size={32} color="white" />
                  <Text className="text-white font-bold mt-2">Live Chat</Text>
                </Pressable>
                <Pressable className="flex-1 bg-black p-6 rounded-[32px] items-center shadow-lg shadow-black/20">
                  <MaterialCommunityIcons name="email-outline" size={32} color="white" />
                  <Text className="text-white font-bold mt-2">Email</Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Hardware Diagnostics</Text>
              <CardPanel intensity={10}>
                <Pressable className="flex-row items-center py-4">
                  <MaterialCommunityIcons name="chip" size={24} color="#34c759" />
                  <View className="flex-1 ml-4">
                    <Text className="text-black font-bold text-lg">Run Diagnostics</Text>
                    <Text className="text-gray-400 text-xs">Test BLE, GPS, and WiFi sensors</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#d1d1d6" />
                </Pressable>
              </CardPanel>
            </View>

            <View className="h-20" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
