import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export default function ScreenSearch() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Екран у розробці</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
  },
});