import React from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardPanel } from "@components/CardPanel";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const router = useRouter();

  const plans = [
    { 
      id: "1", 
      name: "Free", 
      price: "$0", 
      period: "forever",
      features: ["1 Active Tag", "Standard Range", "Community Finding", "Email Support"],
      color: "bg-gray-100",
      textColor: "text-gray-600",
      buttonColor: "bg-gray-200",
      buttonText: "Current Plan"
    },
    { 
      id: "2", 
      name: "Premium", 
      price: "$4.99", 
      period: "per month",
      features: ["Unlimited Tags", "Precision Finding", "Anti-Loss Alerts", "Shared Access", "Priority Support"],
      color: "bg-primary",
      textColor: "text-white",
      buttonColor: "bg-white",
      buttonText: "Go Premium",
      popular: true
    },
    { 
      id: "3", 
      name: "Family", 
      price: "$9.99", 
      period: "per month",
      features: ["All Premium Features", "Up to 5 Members", "Shared History", "Family Map", "VIP Support"],
      color: "bg-black",
      textColor: "text-white",
      buttonColor: "bg-primary",
      buttonText: "Choose Family"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="px-8 pt-4 flex-row justify-between items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </Pressable>
          <Text className="text-black font-bold text-lg">NovaTag Pro</Text>
          <View className="w-10" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-8 mt-8 mb-10">
            <Animated.Text entering={FadeInDown.delay(200)} className="text-black text-4xl font-bold tracking-tight">
              Elevate your{"\n"}experience.
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400)} className="text-gray-400 text-lg mt-4 leading-7">
              Unlock the full potential of your NovaTag ecosystem with advanced features and security.
            </Animated.Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            snapToInterval={width * 0.8 + 16}
            decelerationRate="fast"
          >
            {plans.map((plan, index) => (
              <Animated.View 
                key={plan.id}
                entering={FadeInRight.delay(600 + index * 100)}
                className="mr-4"
                style={{ width: width * 0.8 }}
              >
                <View className={`${plan.color} rounded-[40px] p-8 h-[520px] justify-between shadow-xl`}>
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text className={`${plan.textColor} text-2xl font-bold`}>{plan.name}</Text>
                      {plan.popular && (
                        <View className="bg-white/20 px-3 py-1 rounded-full">
                          <Text className="text-white text-[10px] font-black uppercase">Most Popular</Text>
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-row items-baseline mt-4">
                      <Text className={`${plan.textColor} text-5xl font-black`}>{plan.price}</Text>
                      <Text className={`${plan.textColor} opacity-60 ml-2 font-medium`}>{plan.period}</Text>
                    </View>

                    <View className="mt-8 space-y-4">
                      {plan.features.map((feature, fIdx) => (
                        <View key={fIdx} className="flex-row items-center">
                          <MaterialCommunityIcons 
                            name="check-circle" 
                            size={20} 
                            color={plan.name === "Free" ? "#0066cc" : "white"} 
                            className="opacity-80"
                          />
                          <Text className={`${plan.textColor} ml-3 font-medium opacity-90`}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Pressable 
                    className={`${plan.buttonColor} py-5 rounded-[24px] items-center active:opacity-90 shadow-sm`}
                  >
                    <Text className={`${plan.name === "Free" ? "text-gray-400" : plan.name === "Premium" ? "text-primary" : "text-white"} font-bold text-lg`}>
                      {plan.buttonText}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            ))}
          </ScrollView>

          <View className="px-8 pb-12">
            <Text className="text-gray-400 text-center text-xs leading-5">
              Subscriptions will automatically renew unless canceled 24 hours before the end of the current period. You can manage and cancel your subscriptions in your App Store account settings.
            </Text>
            <View className="flex-row justify-center mt-6 space-x-6">
              <Pressable><Text className="text-primary text-xs font-bold">Terms of Service</Text></Pressable>
              <Pressable><Text className="text-primary text-xs font-bold">Privacy Policy</Text></Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
