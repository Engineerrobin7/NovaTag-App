import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function FamilyScreen() {
  const router = useRouter();

  const familyMembers = [
    { 
      id: "1", 
      name: "Sarah Johnson", 
      role: "Organizer", 
      devices: 4,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      id: "2", 
      name: "David Johnson", 
      role: "Member", 
      devices: 2,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      id: "3", 
      name: "Emily Johnson", 
      role: "Child", 
      devices: 1,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop"
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
          <Text className="text-black font-bold text-lg">Family</Text>
          <Pressable className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="plus" size={24} color="black" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <Text className="text-black text-3xl font-bold mb-2 ml-2">Family Sharing</Text>
          <Text className="text-gray-400 text-lg mb-8 ml-2 leading-7">
            Share devices, locations, and premium benefits with your family.
          </Text>
          
          <View className="space-y-4">
            {familyMembers.map((member, index) => (
              <Animated.View 
                key={member.id}
                entering={FadeInDown.delay(index * 100)}
              >
                <CardPanel intensity={10} className="mb-4">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: member.image }}
                      className="w-14 h-14 rounded-2xl"
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-black font-bold text-lg">{member.name}</Text>
                      <Text className="text-gray-400 text-sm font-medium">{member.role}</Text>
                    </View>
                    <View className="items-end">
                      <View className="bg-primary/10 px-3 py-1 rounded-full">
                        <Text className="text-primary text-xs font-bold">{member.devices} Tags</Text>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d1d6" className="mt-2" />
                    </View>
                  </View>
                </CardPanel>
              </Animated.View>
            ))}
          </View>

          <View className="mt-8 px-2">
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Family Benefits</Text>
            <CardPanel intensity={10} className="mb-6">
              <View className="flex-row items-center py-3 border-b border-gray-50">
                <MaterialCommunityIcons name="map-marker-multiple-outline" size={22} color="#0066cc" />
                <Text className="ml-4 text-black font-medium flex-1">Shared Locations</Text>
                <Text className="text-green-500 text-xs font-bold uppercase">Active</Text>
              </View>
              <View className="flex-row items-center py-3 border-b border-gray-50">
                <MaterialCommunityIcons name="shield-account-outline" size={22} color="#34c759" />
                <Text className="ml-4 text-black font-medium flex-1">Premium Features</Text>
                <Text className="text-green-500 text-xs font-bold uppercase">Shared</Text>
              </View>
              <View className="flex-row items-center py-3">
                <MaterialCommunityIcons name="alert-octagon-outline" size={22} color="#ff3b30" />
                <Text className="ml-4 text-black font-medium flex-1">Emergency Alerts</Text>
                <Text className="text-green-500 text-xs font-bold uppercase">Active</Text>
              </View>
            </CardPanel>
          </View>

          <Pressable 
            onPress={() => {}}
            className="bg-black py-5 rounded-[32px] items-center active:bg-black/90 mt-4 mb-12 shadow-xl shadow-black/20"
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="account-plus-outline" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-3">Invite Someone</Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
