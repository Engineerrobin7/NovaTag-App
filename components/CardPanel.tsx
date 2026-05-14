import React, { ReactNode } from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";

type CardPanelProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  tint?: "light" | "dark" | "default";
};

export function CardPanel({ children, className, intensity = 40, tint = "light" }: CardPanelProps) {
  return (
    <View className={`overflow-hidden rounded-[32px] border border-gray-100/50 shadow-sm ${className}`}>
      <BlurView intensity={intensity} tint={tint} className="p-6">
        {children}
      </BlurView>
    </View>
  );
}
