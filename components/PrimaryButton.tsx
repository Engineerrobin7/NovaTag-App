import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@theme/colors";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: "primary" | "ghost";
};

export function PrimaryButton({ label, onPress, style, variant = "primary" }: PrimaryButtonProps) {
  const buttonStyle = [styles.button, variant === "ghost" && styles.ghost, style];
  const textStyle = [styles.label, variant === "ghost" && styles.ghostLabel];

  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }
  },
  ghost: {
    backgroundColor: "rgba(0, 102, 204, 0.08)",
    borderWidth: 1,
    borderColor: colors.primary
  },
  label: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600"
  },
  ghostLabel: {
    color: colors.primary
  }
});
