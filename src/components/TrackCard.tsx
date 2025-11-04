import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

interface TrackCardProps {
  title: string;
  artist: string;
  imageUrl?: string | null;
  onPress: () => void;
}

const FALLBACK_IMAGE = "https://placehold.co/64x64?text=♪";

const TrackCardComponent = ({ title, artist, imageUrl, onPress }: TrackCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: colors.gray200 }}>
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
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.gray200,
  },
  meta: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  artist: {
    marginTop: 4,
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export const TrackCard = memo(TrackCardComponent);

export default TrackCard;

