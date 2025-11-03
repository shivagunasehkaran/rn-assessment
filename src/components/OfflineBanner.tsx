import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface OfflineBannerProps {
  visible: boolean;
}

const OfflineBannerComponent = ({ visible }: OfflineBannerProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are offline. Showing cached results.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  text: {
    color: "#92400e",
    fontSize: 14,
  },
});

export const OfflineBanner = memo(OfflineBannerComponent);

export default OfflineBanner;

