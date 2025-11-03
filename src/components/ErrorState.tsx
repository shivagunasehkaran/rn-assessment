import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorStateComponent = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
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
    color: "#b91c1c",
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export const ErrorState = memo(ErrorStateComponent);

export default ErrorState;

