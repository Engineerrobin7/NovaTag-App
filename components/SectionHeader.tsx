import React from "react";
import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <View className={`mb-8 ${className}`}>
      <Text className="text-black text-4xl font-bold tracking-tight leading-tight">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-gray-400 text-lg mt-2 leading-7">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
