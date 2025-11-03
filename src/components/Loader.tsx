import { memo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoaderProps {
  size?: number | "small" | "large";
}

const LoaderComponent = ({ size = "small" }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#111827" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Loader = memo(LoaderComponent);

export default Loader;

