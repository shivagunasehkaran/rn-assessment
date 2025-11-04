import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { strings } from "../strings";
import type { ErrorStateProps } from "../types/ui";

const ErrorStateComponent = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>{strings.retry}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.gray900,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export const ErrorState = memo(ErrorStateComponent);

export default ErrorState;
