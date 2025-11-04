import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import type { MessageProps } from "../types/ui";

interface EmptyStateProps extends MessageProps {}

const EmptyStateComponent = ({ message }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export const EmptyState = memo(EmptyStateComponent);

export default EmptyState;

