import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

interface TrackSkeletonListProps {
  count?: number;
}

const TrackSkeletonListComponent = ({ count = 6 }: TrackSkeletonListProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.thumbnail} />
          <View style={styles.meta}>
            <View style={styles.title} />
            <View style={styles.subtitle} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.gray100,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.gray200,
  },
  meta: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  title: {
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.gray200,
    width: "70%",
  },
  subtitle: {
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.gray200,
    width: "50%",
  },
});

export const TrackSkeletonList = memo(TrackSkeletonListComponent);

export default TrackSkeletonList;

