import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Dimensions, Image, ScrollView, ActivityIndicator, TextInput, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import { useDeviceStore } from "@store/useDeviceStore";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceAddresses, setDeviceAddresses] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);

  const devices = useDeviceStore((state) => state.devices);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  // Reverse Geocoding for devices
  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses: Record<string, string> = {};
      for (const device of devices) {
        const lat = device.lat || 51.5074;
        const lng = device.lng || -0.1278;
        try {
          const result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
          if (result && result.length > 0) {
            const addr = result[0];
            newAddresses[device.id] = `${addr.streetNumber || ""} ${addr.street || ""}, ${addr.city || ""}`.trim();
          }
        } catch (e) {
          console.error("Geocoding failed for device", device.id, e);
        }
      }
      setDeviceAddresses(newAddresses);
    };

    if (devices.length > 0) {
      fetchAddresses();
    }
  }, [devices]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      } else {
        Alert.alert("Location Not Found", "Could not find the location you searched for.");
      }
    } catch (e) {
      Alert.alert("Search Error", "An error occurred while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  } : {
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        className="flex-1"
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        showsUserLocation
      >
        {devices.map(device => (
          <Marker 
            key={device.id}
            coordinate={{ 
              latitude: device.lat || (userLocation?.latitude || 51.5074) + (Math.random() - 0.5) * 0.01, 
              longitude: device.lng || (userLocation?.longitude || -0.1278) + (Math.random() - 0.5) * 0.01 
            }}
            onPress={() => setSelectedDevice(device)}
          >
            <View className="items-center">
              <View className="bg-white p-1 rounded-full shadow-lg">
                <View className={`w-10 h-10 rounded-full ${device.color || "bg-primary"} items-center justify-center`}>
                  <MaterialCommunityIcons name={device.icon as any} size={20} color="white" />
                </View>
              </View>
              <View className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
            </View>
          </Marker>
        ))}

        {userLocation && (
          <Circle 
            center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            radius={500}
            strokeColor="rgba(0, 102, 204, 0.3)"
            fillColor="rgba(0, 102, 204, 0.05)"
          />
        )}
      </MapView>

      {/* Floating Header */}
      <SafeAreaView className="absolute top-0 left-0 right-0 px-6 pt-4" pointerEvents="box-none">
        <View className="flex-row items-center mb-4">
          <Pressable 
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-white shadow-lg items-center justify-center mr-3"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="black" />
          </Pressable>
          
          <View className="flex-1 h-12 bg-white rounded-2xl shadow-lg px-4 flex-row items-center">
            <MaterialCommunityIcons name="magnify" size={20} color="#7a7a7a" />
            <TextInput
              className="flex-1 ml-2 text-black font-medium"
              placeholder="Search location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {isSearching && <ActivityIndicator size="small" color="#0066cc" />}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-12">
          <View className="bg-white/90 px-4 h-10 rounded-full shadow-md border border-white/20 items-center justify-center mr-2">
            <Text className="text-black font-semibold">{devices.length} Tags Found</Text>
          </View>
          <Pressable className="bg-white/90 px-4 h-10 rounded-full shadow-md border border-white/20 flex-row items-center justify-center mr-2">
            <MaterialCommunityIcons name="layers-outline" size={18} color="black" className="mr-2" />
            <Text className="text-black font-semibold">Layers</Text>
          </Pressable>
          <Pressable className="bg-white/90 px-4 h-10 rounded-full shadow-md border border-white/20 flex-row items-center justify-center">
            <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color="black" className="mr-2" />
            <Text className="text-black font-semibold">Weather</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Sheet - Find My Style */}
      <Animated.View 
        entering={SlideInDown.duration(600)}
        className="absolute bottom-0 left-0 right-0 h-[380px] bg-white rounded-t-[40px] shadow-2xl overflow-hidden"
      >
        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mt-3 mb-6" />
        
        <ScrollView className="px-8">
          <Text className="text-black text-2xl font-bold mb-6">Devices</Text>
          
          {devices.length > 0 ? (
            devices.map(device => (
              <Pressable 
                key={device.id}
                onPress={() => setSelectedDevice(device)}
                className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50 rounded-xl"
              >
                <View className={`w-14 h-14 rounded-2xl ${device.color || "bg-gray-50"} items-center justify-center`}>
                  <MaterialCommunityIcons name={device.icon as any} size={32} color={device.color ? "white" : "#0066cc"} />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-black font-bold text-lg">{device.name}</Text>
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {deviceAddresses[device.id] || (device.status === "nearby" ? "Nearby you" : "Calculating address...")}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`font-semibold ${device.status === "nearby" ? "text-green-500" : "text-gray-400"}`}>
                    {device.status}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialCommunityIcons name="battery-80" size={14} color="#7a7a7a" />
                    <Text className="text-gray-400 text-xs ml-1">{device.battery}%</Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="items-center py-10">
              <Text className="text-gray-400">No devices to track</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Selected Device Overlay (if any) */}
      {selectedDevice && (
        <View className="absolute bottom-12 left-8 right-8 h-24 bg-black rounded-3xl shadow-2xl overflow-hidden">
          <BlurView intensity={20} tint="dark" className="flex-1 flex-row items-center px-6">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">Find {selectedDevice.name}</Text>
              <Text className="text-white/60" numberOfLines={1}>
                {deviceAddresses[selectedDevice.id] || "Locating..."}
              </Text>
            </View>
            <Pressable 
              onPress={() => router.push("/precision")}
              className="bg-primary px-6 py-3 rounded-2xl shadow-lg shadow-primary/40"
            >
              <Text className="text-white font-bold">Find</Text>
            </Pressable>
            <Pressable 
              onPress={() => setSelectedDevice(null)}
              className="ml-4 w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={20} color="white" />
            </Pressable>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#f5f5f5"}]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#616161"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{"color": "#ffffff"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#e9e9e9"}]
  }
];
