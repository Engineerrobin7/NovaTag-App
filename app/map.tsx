import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Dimensions, ScrollView, ActivityIndicator, TextInput, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown, SlideInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { useDeviceStore } from "@store/useDeviceStore";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

// Custom Component for Pulsing Marker
const PulsingMarker = ({ device, coordinate, onPress }: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(2.5, { duration: 1500 }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 1500 }), -1, false);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const color = device.color || "#0066cc";

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View className="items-center justify-center" style={{ width: 60, height: 60 }}>
        {/* Pulsing Ring */}
        <Animated.View 
          className="absolute rounded-full" 
          style={[{ width: 30, height: 30, backgroundColor: color }, ringStyle]} 
        />
        
        {/* Core Pin */}
        <View className="bg-white p-0.5 rounded-full shadow-lg">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <MaterialCommunityIcons name={device.icon as any} size={20} color="white" />
          </View>
        </View>
        <View className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
      </View>
    </Marker>
  );
};

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

  // Stable fallback coordinates per device
  const fallbackCoords = useRef<Record<string, { lat: number; lng: number }>>({});

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
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        className="flex-1"
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        showsUserLocation
      >
        {devices.map(device => {
          if (!fallbackCoords.current[device.id]) {
            fallbackCoords.current[device.id] = {
              lat: (userLocation?.latitude || 51.5074) + (Math.random() - 0.5) * 0.01,
              lng: (userLocation?.longitude || -0.1278) + (Math.random() - 0.5) * 0.01,
            };
          }
          const coords = fallbackCoords.current[device.id];
          return (
            <PulsingMarker
              key={device.id}
              device={device}
              coordinate={{ 
                latitude: device.lat || coords.lat, 
                longitude: device.lng || coords.lng,
              }}
              onPress={() => setSelectedDevice(device)}
            />
          );
        })}

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
            className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center mr-3"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
          </Pressable>
          
          <View className="flex-1 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-4 flex-row items-center">
            <MaterialCommunityIcons name="magnify" size={20} color="#7a7a7a" />
            <TextInput
              className="flex-1 ml-2 text-white font-medium"
              placeholder="Search location..."
              placeholderTextColor="#7a7a7a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {isSearching && <ActivityIndicator size="small" color="#0066cc" />}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-12">
          <View className="bg-black/50 backdrop-blur-md px-4 h-10 rounded-full border border-white/10 items-center justify-center mr-2">
            <Text className="text-white font-semibold">{devices.length} Tags Found</Text>
          </View>
          <Pressable className="bg-black/50 backdrop-blur-md px-4 h-10 rounded-full border border-white/10 flex-row items-center justify-center mr-2">
            <MaterialCommunityIcons name="layers-outline" size={18} color="white" className="mr-2" />
            <Text className="text-white font-semibold">Layers</Text>
          </Pressable>
          <Pressable className="bg-black/50 backdrop-blur-md px-4 h-10 rounded-full border border-white/10 flex-row items-center justify-center">
            <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color="white" className="mr-2" />
            <Text className="text-white font-semibold">Weather</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Sheet - Glassmorphic */}
      <Animated.View 
        entering={SlideInDown.duration(600)}
        className="absolute bottom-0 left-0 right-0 h-[350px] rounded-t-[40px] overflow-hidden"
      >
        <BlurView intensity={80} tint="dark" className="flex-1 px-8">
          <View className="w-12 h-1.5 bg-white/20 rounded-full self-center mt-3 mb-6" />
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-white text-2xl font-bold mb-6">Devices</Text>
            
            {devices.length > 0 ? (
              devices.map(device => (
                <Pressable 
                  key={device.id}
                  onPress={() => setSelectedDevice(device)}
                  className="flex-row items-center py-4 border-b border-white/5 active:bg-white/5 rounded-xl"
                >
                  <View 
                    className="w-14 h-14 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: device.color || "#1a1a1a" }}
                  >
                    <MaterialCommunityIcons name={device.icon as any} size={32} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white font-bold text-lg">{device.name}</Text>
                    <Text className="text-white/40 text-sm" numberOfLines={1}>
                      {deviceAddresses[device.id] || (device.status === "nearby" ? "Nearby you" : "Calculating address...")}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className={`font-semibold ${device.status === "nearby" ? "text-green-500" : "text-white/40"}`}>
                      {device.status}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MaterialCommunityIcons name="battery-80" size={14} color="#7a7a7a" />
                      <Text className="text-white/40 text-xs ml-1">{device.battery}%</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View className="items-center py-10">
                <Text className="text-white/40">No devices to track</Text>
              </View>
            )}
          </ScrollView>
        </BlurView>
      </Animated.View>

      {/* Selected Device Overlay */}
      {selectedDevice && (
        <View className="absolute bottom-12 left-8 right-8 h-24 bg-black/80 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <BlurView intensity={30} tint="dark" className="flex-1 flex-row items-center px-6">
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

// Custom Dark Map Style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#1a1a1a"}]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#757575"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#1a1a1a"}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{"color": "#757575"}]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#121212"}]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#757575"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#2c2c2c"}]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#8a8a8a"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}]
  }
];
