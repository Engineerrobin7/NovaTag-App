import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, Switch, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function DeviceSettingsScreen() {
  const router = useRouter();
  const [name, setName] = useState("Keys");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [batteryAlerts, setBatteryAlerts] = useState(true);
  const [motionAlerts, setMotionAlerts] = useState(false);

  const SettingItem = ({ icon, label, value, type = "arrow", onToggle, onPress, color }: any) => (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50 rounded-xl"
    >
      <View className={`w-8 h-8 rounded-lg ${color || "bg-gray-100"} items-center justify-center`}>
        <MaterialCommunityIcons name={icon} size={18} color={color ? "white" : "#7a7a7a"} />
      </View>
      <Text className="flex-1 ml-4 text-black font-medium text-lg">{label}</Text>
      {type === "arrow" && (
        <View className="flex-row items-center">
          {value && <Text className="text-gray-400 mr-2">{value}</Text>}
          <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d1d6" />
        </View>
      )}
      {type === "switch" && (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: "#e9e9eb", true: "#34c759" }}
          thumbColor="#ffffff"
        />
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </Pressable>
          <Text className="text-black font-bold text-lg">Tag Settings</Text>
          <Pressable onPress={() => router.back()} className="text-primary font-bold">Done</Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
          <View className="items-center py-8">
            <View className="w-24 h-24 rounded-[32px] bg-primary items-center justify-center shadow-xl shadow-primary/20">
              <MaterialCommunityIcons name="key-variant" size={48} color="white" />
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              className="text-black text-2xl font-bold mt-4 text-center"
              placeholder="Tag Name"
            />
          </View>

          <View className="space-y-8">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Alerts & Sound</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="volume-high" 
                  label="Play Sound" 
                  type="switch" 
                  value={soundEnabled} 
                  onToggle={setSoundEnabled}
                  color="bg-blue-500"
                />
                <SettingItem 
                  icon="vibrate" 
                  label="Haptic Feedback" 
                  type="switch" 
                  value={vibration} 
                  onToggle={setVibration}
                  color="bg-purple-500"
                />
                <SettingItem 
                  icon="battery-charging-low" 
                  label="Battery Alerts" 
                  type="switch" 
                  value={batteryAlerts} 
                  onToggle={setBatteryAlerts}
                  color="bg-orange-500"
                />
                <SettingItem 
                  icon="run" 
                  label="Motion Alerts" 
                  type="switch" 
                  value={motionAlerts} 
                  onToggle={setMotionAlerts}
                  color="bg-green-500"
                />
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Location</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="shield-home-outline" 
                  label="Safe Zones" 
                  value="1 Zone"
                  onPress={() => {}}
                />
                <SettingItem 
                  icon="history" 
                  label="Location History" 
                  onPress={() => {}}
                />
              </CardPanel>
            </View>

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2 mb-4">Danger Zone</Text>
              <CardPanel intensity={10}>
                <SettingItem 
                  icon="trash-can-outline" 
                  label="Remove NovaTag" 
                  onPress={() => {}}
                  color="bg-red-500"
                />
                <SettingItem 
                  icon="refresh" 
                  label="Factory Reset" 
                  onPress={() => {}}
                />
              </CardPanel>
            </View>

            <View className="h-20" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
