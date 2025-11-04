import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { strings } from "../strings";

interface OfflineBannerProps {
  visible: boolean;
}

const OfflineBannerComponent = ({ visible }: OfflineBannerProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{strings.offlineBanner}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.yellow50,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  text: {
    color: colors.warning,
    fontSize: 14,
  },
});

export const OfflineBanner = memo(OfflineBannerComponent);

export default OfflineBanner;

