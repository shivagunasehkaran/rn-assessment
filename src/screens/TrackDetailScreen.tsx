import { memo, useMemo, useCallback } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import OfflineBanner from "../components/OfflineBanner";
import TrackPlayer from "../components/TrackPlayer";
import type { TrackDetail, TrackEntity } from "../features/tracks";
import { colors } from "../theme/colors";
import { strings } from "../strings";
import { formatDuration, formatReleaseDate } from "../utils/util";
import { FALLBACK_ARTWORK_URI } from "../utils/constants";
import {
  getResponsiveFontSize,
  getResponsivePadding,
  SCREEN_DIMENSIONS,
} from "../utils/responsive";

type TrackDetailScreenProps = {
  track?: TrackEntity | TrackDetail;
  detail?: TrackDetail;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isOffline: boolean;
  onRetry: () => void;
  onBack: () => void;
};

const TrackDetailScreenComponent = ({
  track,
  detail,
  isLoading,
  isRefreshing,
  error,
  isOffline,
  onRetry,
  onBack,
}: TrackDetailScreenProps) => {
  const imageSource = track?.imageUrl
    ? { uri: track.imageUrl }
    : FALLBACK_ARTWORK_URI;

  const metadata = useMemo(
    () => [
      {
        label: strings.trackDetailMetadata.album,
        value: detail?.albumName ?? "—",
      },
      {
        label: strings.trackDetailMetadata.duration,
        value: formatDuration(detail?.duration),
      },
      {
        label: strings.trackDetailMetadata.released,
        value: formatReleaseDate(detail?.releaseDate),
      },
    ],
    [detail?.albumName, detail?.duration, detail?.releaseDate]
  );

  if (!track && isLoading) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <Loader size="large" />
      </SafeAreaView>
    );
  }

  if (!track && error) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <ErrorState message={error} onRetry={onRetry} />
      </SafeAreaView>
    );
  }

  if (!track) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <ErrorState message={strings.trackDetailNotFound} onRetry={onBack} />
      </SafeAreaView>
    );
  }

  const handleShare = useCallback(() => {
    if (detail?.shareUrl) {
      Linking.openURL(detail.shareUrl).catch(() => undefined);
    }
  }, [detail?.shareUrl]);

  const handleLicense = useCallback(() => {
    if (detail?.licenseUrl) {
      Linking.openURL(detail.licenseUrl).catch(() => undefined);
    }
  }, [detail?.licenseUrl]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner visible={isOffline} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.backLink} onPress={onBack}>
          <Text style={styles.backText}>{strings.trackDetailBack}</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>{track.name}</Text>
          <Text style={styles.subtitle}>{track.artistName}</Text>
        </View>

        <TrackPlayer
          trackId={track.id}
          title={track.name}
          artist={track.artistName}
          album={detail?.albumName}
          audioUrl={track.audioUrl}
          artworkUrl={track.imageUrl}
          durationMs={detail?.duration ? detail.duration * 1000 : undefined}
        />

        <View style={styles.metadataSection}>
          <Text style={styles.sectionHeading}>{strings.trackDetailTitle}</Text>
          <View style={styles.metadataGrid}>
            {metadata.map((entry) => (
              <View key={entry.label} style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>{entry.label}</Text>
                <Text style={styles.metadataValue}>{entry.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.linksRow}>
            {detail?.licenseUrl ? (
              <Pressable style={styles.linkButton} onPress={handleLicense}>
                <Text style={styles.linkText}>
                  {strings.trackDetailActions.viewLicense}
                </Text>
              </Pressable>
            ) : null}
            {detail?.shareUrl ? (
              <Pressable style={styles.linkButton} onPress={handleShare}>
                <Text style={styles.linkText}>
                  {strings.trackDetailActions.openOnJamendo}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {isRefreshing ? (
          <View style={styles.refreshing}>
            <Loader size="small" />
            <Text style={styles.refreshingText}>
              {strings.trackDetailRefreshing}
            </Text>
          </View>
        ) : null}

        {error && track ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(TrackDetailScreenComponent);

const maxContentWidth = SCREEN_DIMENSIONS.isTablet ? 800 : undefined;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: getResponsivePadding(16),
    gap: getResponsivePadding(24),
    maxWidth: maxContentWidth,
    alignSelf: "center",
    width: "100%",
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: getResponsivePadding(16),
  },
  backLink: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  backText: {
    color: colors.primary,
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
  },
  heroArtwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: colors.gray200,
    maxWidth: maxContentWidth ? 600 : undefined,
    alignSelf: "center",
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: getResponsiveFontSize(24, 32),
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16, 20),
    color: colors.text.secondary,
    fontWeight: "500",
  },
  metadataSection: {
    gap: getResponsivePadding(16),
  },
  sectionHeading: {
    fontSize: getResponsiveFontSize(20, 26),
    fontWeight: "700",
    color: colors.text.primary,
  },
  metadataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getResponsivePadding(16),
  },
  metadataItem: {
    width: "48%",
    gap: 4,
  },
  metadataLabel: {
    color: colors.text.secondary,
    fontSize: getResponsiveFontSize(12),
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metadataValue: {
    color: colors.text.primary,
    fontSize: getResponsiveFontSize(16, 20),
    fontWeight: "600",
  },
  linksRow: {
    flexDirection: "row",
    gap: getResponsivePadding(12),
    flexWrap: "wrap",
  },
  linkButton: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderRadius: 999,
    backgroundColor: colors.blue50,
  },
  linkText: {
    color: colors.blue600,
    fontSize: getResponsiveFontSize(14, 16),
    fontWeight: "600",
  },
  refreshing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshingText: {
    color: colors.text.secondary,
    fontSize: getResponsiveFontSize(14),
  },
});
