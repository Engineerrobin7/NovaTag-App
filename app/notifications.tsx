import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    { 
      id: "1", 
      time: "Just now", 
      title: "Battery Low", 
      body: "Your Backpack tag is at 12%. Consider charging it soon.", 
      read: false,
      icon: "battery-alert-outline",
      color: "text-orange-500"
    },
    { 
      id: "2", 
      time: "10m ago", 
      title: "Device Nearby", 
      body: "Keys detected nearby. Signal strength is strong.", 
      read: false,
      icon: "bluetooth-connect",
      color: "text-blue-500"
    },
    { 
      id: "3", 
      time: "1h ago", 
      title: "Pairing Complete", 
      body: "New luggage tag has been successfully linked to your account.", 
      read: true,
      icon: "check-circle-outline",
      color: "text-green-500"
    },
    { 
      id: "4", 
      time: "Yesterday", 
      title: "Safe Zone Alert", 
      body: "Keys left your Home safe zone at 10:45 AM.", 
      read: true,
      icon: "map-marker-radius-outline",
      color: "text-red-500"
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
          <Text className="text-black font-bold text-lg">Activity</Text>
          <Pressable className="text-primary font-semibold">Clear All</Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <Text className="text-black text-3xl font-bold mb-8 ml-2">Notifications</Text>
          
          <View className="space-y-4">
            {notifications.map((notif, index) => (
              <Animated.View 
                key={notif.id}
                entering={FadeInDown.delay(index * 100)}
              >
                <CardPanel intensity={notif.read ? 5 : 15} className={`mb-4 ${!notif.read ? "border-primary/20 shadow-lg shadow-primary/5" : ""}`}>
                  <View className="flex-row">
                    <View className="w-10 h-10 items-center justify-center">
                      <MaterialCommunityIcons name={notif.icon as any} size={24} className={notif.color} />
                    </View>
                    <View className="flex-1 ml-3">
                      <View className="flex-row justify-between items-center">
                        <Text className={`font-bold text-lg ${notif.read ? "text-gray-600" : "text-black"}`}>
                          {notif.title}
                        </Text>
                        <Text className="text-gray-400 text-xs">{notif.time}</Text>
                      </View>
                      <Text className={`mt-1 leading-5 ${notif.read ? "text-gray-400" : "text-gray-500"}`}>
                        {notif.body}
                      </Text>
                      
                      {!notif.read && (
                        <View className="flex-row mt-4">
                          <Pressable className="bg-primary px-4 py-2 rounded-full mr-2">
                            <Text className="text-white text-xs font-bold">View Detail</Text>
                          </Pressable>
                          <Pressable className="bg-gray-100 px-4 py-2 rounded-full">
                            <Text className="text-gray-600 text-xs font-bold">Mark as Read</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                </CardPanel>
              </Animated.View>
            ))}
          </View>

          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
