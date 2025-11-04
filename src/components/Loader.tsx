import { memo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";
import type { LoaderProps } from "../types/ui";

const LoaderComponent = ({ size = "small" }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.text.primary} />
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

