import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function AlertsScreen() {
  const router = useRouter();

  const alerts = [
    { 
      id: "1", 
      icon: "battery-10", 
      title: "Low Battery", 
      body: "Backpack is at 12%. Consider charging soon.", 
      time: "10m ago",
      type: "warning",
      color: "bg-orange-500"
    },
    { 
      id: "2", 
      icon: "map-marker-radius", 
      title: "Left Safe Zone", 
      body: "Keys left the 'Home' safe zone at 10:45 AM.", 
      time: "2h ago",
      type: "info",
      color: "bg-blue-500"
    },
    { 
      id: "3", 
      icon: "shield-alert", 
      title: "Anti-Loss Alert", 
      body: "Your Wallet was left behind near Starbucks.", 
      time: "4h ago",
      type: "critical",
      color: "bg-red-500"
    },
    { 
      id: "4", 
      icon: "update", 
      title: "Firmware Update", 
      body: "New features available for your NovaTag Pro.", 
      time: "Yesterday",
      type: "info",
      color: "bg-emerald-500"
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
          <Text className="text-black font-bold text-lg">Alerts</Text>
          <Pressable className="text-primary font-semibold">Clear</Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <Text className="text-black text-3xl font-bold mb-6 ml-2">Smart Notifications</Text>
          
          {alerts.map((alert, index) => (
            <Animated.View 
              key={alert.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <CardPanel intensity={10} className="mb-4">
                <View className="flex-row">
                  <View className={`w-12 h-12 rounded-2xl ${alert.color} items-center justify-center`}>
                    <MaterialCommunityIcons name={alert.icon as any} size={24} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-black font-bold text-lg">{alert.title}</Text>
                      <Text className="text-gray-400 text-xs">{alert.time}</Text>
                    </View>
                    <Text className="text-gray-500 mt-1 leading-5">{alert.body}</Text>
                    
                    <View className="flex-row mt-4">
                      <Pressable className="bg-gray-100 px-4 py-2 rounded-full mr-2">
                        <Text className="text-gray-600 text-xs font-bold">Dismiss</Text>
                      </Pressable>
                      {alert.type === "critical" && (
                        <Pressable 
                          onPress={() => router.push("/map")}
                          className="bg-primary/10 px-4 py-2 rounded-full"
                        >
                          <Text className="text-primary text-xs font-bold">Find Device</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              </CardPanel>
            </Animated.View>
          ))}
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
