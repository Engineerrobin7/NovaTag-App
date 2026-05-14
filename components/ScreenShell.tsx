import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "@theme/colors";

type ScreenShellProps = {
  children: ReactNode;
  overlay?: ReactNode;
  contentStyle?: object;
};

export function ScreenShell({ children, overlay, contentStyle }: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backdrop} />
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {overlay && (
        <BlurView intensity={80} tint="light" style={styles.overlay}>
          {overlay}
        </BlurView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(29,29,31,0.08)"
  }
});
