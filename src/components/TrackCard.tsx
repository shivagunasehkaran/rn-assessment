import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { FALLBACK_IMAGE } from "../utils/constants";
import {
  getResponsiveFontSize,
  getResponsivePadding,
  scaleSize,
} from "../utils/responsive";

interface TrackCardProps {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onPress: () => void;
}

const TrackCardComponent = ({
  title,
  artist,
  imageUrl,
  onPress,
}: TrackCardProps) => {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: colors.gray200 }}
    >
      <Image
        source={{ uri: imageUrl || FALLBACK_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {artist}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsivePadding(12),
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: scaleSize(64),
    height: scaleSize(64),
    borderRadius: 8,
    backgroundColor: colors.gray200,
  },
  meta: {
    flex: 1,
    marginLeft: getResponsivePadding(12),
  },
  title: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: colors.text.primary,
  },
  artist: {
    marginTop: 4,
    fontSize: getResponsiveFontSize(14),
    color: colors.text.secondary,
  },
});

export const TrackCard = memo(TrackCardComponent);

export default TrackCard;
