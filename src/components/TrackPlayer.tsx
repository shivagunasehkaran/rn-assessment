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
import { colors } from "../theme/colors";
import { strings } from "../strings";
import { FALLBACK_ARTWORK_URI } from "../utils/constants";
import { formatTime } from "../utils/util";
import {
  getResponsiveFontSize,
  getResponsivePadding,
  scaleSize,
} from "../utils/responsive";

type TrackPlayerProps = {
  trackId: string;
  title: string;
  artist: string;
  album?: string | null;
  audioUrl: string;
  artworkUrl?: string | null;
  durationMs?: number;
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
        <Text style={styles.unavailableTitle}>{strings.playerUnavailable}</Text>
        <Text style={styles.unavailableSubtitle}>
          {strings.playerUnavailableSubtitle}
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
          accessibilityLabel={strings.playerSeekBackLabel}
        >
          <Text style={styles.secondaryButtonText}>
            {strings.playerSeekBack}
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying ? strings.playerPauseLabel : strings.playerPlayLabel
          }
          disabled={isBusy}
        >
          {isBusy ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isPlaying ? strings.playerPause : strings.playerPlay}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => seekForward(15000)}
          accessibilityRole="button"
          accessibilityLabel={strings.playerSeekForwardLabel}
        >
          <Text style={styles.secondaryButtonText}>
            {strings.playerSeekForward}
          </Text>
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
    backgroundColor: colors.yellow50,
    padding: getResponsivePadding(16),
    gap: 8,
  },
  unavailableTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "700",
    color: colors.warning,
  },
  unavailableSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: colors.yellow600,
  },
  container: {
    borderRadius: 16,
    backgroundColor: colors.player.background,
    padding: getResponsivePadding(16),
    gap: getResponsivePadding(16),
  },
  header: {
    flexDirection: "row",
    gap: getResponsivePadding(16),
  },
  artwork: {
    width: scaleSize(88),
    height: scaleSize(88),
    borderRadius: 12,
    backgroundColor: colors.player.surface,
  },
  headerMeta: {
    flex: 1,
    justifyContent: "space-between",
    gap: 4,
  },
  title: {
    color: colors.player.text,
    fontSize: getResponsiveFontSize(18, 22),
    fontWeight: "700",
  },
  artist: {
    color: colors.player.textSecondary,
    fontSize: getResponsiveFontSize(14, 16),
    fontWeight: "500",
  },
  album: {
    color: colors.player.textTertiary,
    fontSize: getResponsiveFontSize(12),
  },
  progressContainer: {
    gap: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: colors.gray700,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.player.progress,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: colors.player.textSecondary,
    fontSize: getResponsiveFontSize(12),
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: 999,
    backgroundColor: colors.primary,
    minWidth: scaleSize(96),
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: getResponsiveFontSize(16, 18),
    fontWeight: "700",
  },
  secondaryButton: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderRadius: 999,
    backgroundColor: colors.player.surface,
  },
  secondaryButtonText: {
    color: colors.player.text,
    fontSize: getResponsiveFontSize(14, 16),
    fontWeight: "600",
  },
});
