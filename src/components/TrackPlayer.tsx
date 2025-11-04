import { memo, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTrackPlayer } from "../hooks/useTrackPlayer";

type TrackPlayerProps = {
  trackId: string;
  title: string;
  artist: string;
  album?: string | null;
  audioUrl: string;
  artworkUrl?: string | null;
  durationMs?: number;
};

const FALLBACK_ARTWORK_URI = Image.resolveAssetSource(
  require("../../assets/icon.png")
).uri;

const formatTime = (milliseconds: number): string => {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const TrackPlayerComponent = ({
  trackId,
  title,
  artist,
  album,
  audioUrl,
  artworkUrl,
  durationMs: providedDuration,
}: TrackPlayerProps) => {
  const artwork = artworkUrl ?? FALLBACK_ARTWORK_URI;

  const {
    isAvailable,
    isPlaying,
    isBusy,
    position,
    durationMs,
    effectiveDurationMs,
    togglePlay,
    seekBack,
    seekForward,
    seekToRatio,
  } = useTrackPlayer({
    trackId,
    title,
    artist,
    album,
    audioUrl,
    artworkUrl: artwork,
    durationMs: providedDuration,
  });

  if (!isAvailable) {
    return (
      <View style={styles.unavailableContainer}>
        <Text style={styles.unavailableTitle}>Audio playback unavailable</Text>
        <Text style={styles.unavailableSubtitle}>
          Create a development build to enable the Jamendo player.
        </Text>
      </View>
    );
  }

  const progressWidthRef = useRef<number>(0);

  const handleSeekBarLayout = useCallback((width: number) => {
    progressWidthRef.current = width;
  }, []);

  const handleSeekFromPress = useCallback(
    (event: GestureResponderEvent) => {
      const width = progressWidthRef.current;
      if (!width || !durationMs) {
        return;
      }

      const ratio = Math.min(
        Math.max(event.nativeEvent.locationX / width, 0),
        1
      );
      seekToRatio(ratio);
    },
    [durationMs, seekToRatio]
  );

  const progressRatio = useMemo(() => {
    if (!durationMs) {
      return 0;
    }

    const rawRatio = position / durationMs;
    if (!Number.isFinite(rawRatio)) {
      return 0;
    }

    return Math.min(Math.max(rawRatio, 0), 1);
  }, [position, durationMs]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: artwork }} style={styles.artwork} />
        <View style={styles.headerMeta}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={2}>
            {artist}
          </Text>
          {album ? (
            <Text style={styles.album} numberOfLines={2}>
              {album}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="adjustable"
        onPress={handleSeekFromPress}
        style={styles.progressContainer}
        onLayout={(event) =>
          handleSeekBarLayout(event.nativeEvent.layout.width)
        }
      >
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressRatio * 100}%` }]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>{formatTime(position)}</Text>
          <Text style={styles.progressLabel}>
            {formatTime(effectiveDurationMs)}
          </Text>
        </View>
      </Pressable>

      <View style={styles.controlsRow}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => seekBack(15000)}
          accessibilityRole="button"
          accessibilityLabel="Seek backward"
        >
          <Text style={styles.secondaryButtonText}>{"« 15s"}</Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause playback" : "Play track"}
          disabled={isBusy}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => seekForward(15000)}
          accessibilityRole="button"
          accessibilityLabel="Seek forward"
        >
          <Text style={styles.secondaryButtonText}>{"15s »"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const TrackPlayer = memo(TrackPlayerComponent);

export default TrackPlayer;

const styles = StyleSheet.create({
  unavailableContainer: {
    borderRadius: 16,
    backgroundColor: "#fef3c7",
    padding: 16,
    gap: 8,
  },
  unavailableTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400e",
  },
  unavailableSubtitle: {
    fontSize: 14,
    color: "#b45309",
  },
  container: {
    borderRadius: 16,
    backgroundColor: "#111827",
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    gap: 16,
  },
  artwork: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
  headerMeta: {
    flex: 1,
    justifyContent: "space-between",
    gap: 4,
  },
  title: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "700",
  },
  artist: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "500",
  },
  album: {
    color: "#9ca3af",
    fontSize: 12,
  },
  progressContainer: {
    gap: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#374151",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#60a5fa",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: "#d1d5db",
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    minWidth: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1f2937",
  },
  secondaryButtonText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
});
