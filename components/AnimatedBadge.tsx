import { StyleSheet, Text, View } from "react-native";
import { colors } from "@theme/colors";

type AnimatedBadgeProps = {
  label: string;
  value: string;
};

export function AnimatedBadge({ label, value }: AnimatedBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(0, 102, 204, 0.08)",
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 4
  },
  value: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  }
});
