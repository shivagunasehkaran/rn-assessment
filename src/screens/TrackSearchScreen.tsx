import { memo, useCallback, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import OfflineBanner from "../components/OfflineBanner";
import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";
import TrackSkeletonList from "../components/TrackSkeletonList";
import type { TrackEntity } from "../features/tracks";
import { colors } from "../theme/colors";
import { strings } from "../strings";
import {
  getResponsiveFontSize,
  getResponsivePadding,
  SCREEN_DIMENSIONS,
} from "../utils/responsive";

type TrackSearchScreenProps = {
  searchText: string;
  onChangeSearchText: (text: string) => void;
  tracks: TrackEntity[];
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  hasActiveQuery: boolean;
  listError: string | null;
  onRetryInitial: () => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onSelectTrack: (id: string) => void;
  isOffline: boolean;
  showLoadMoreHint: boolean;
};

const TrackSearchScreen = ({
  searchText,
  onChangeSearchText,
  tracks,
  isInitialLoading,
  isFetchingMore,
  isRefreshing,
  hasActiveQuery,
  listError,
  onRetryInitial,
  onLoadMore,
  onRefresh,
  onSelectTrack,
  isOffline,
  showLoadMoreHint,
}: TrackSearchScreenProps) => {
  const renderItem = useCallback(
    ({ item }: { item: TrackEntity }) => {
      const handlePress = () => {
        onSelectTrack(item.id);
      };
      return (
        <TrackCard
          title={item.name}
          artist={item.artistName}
          imageUrl={item.imageUrl}
          onPress={handlePress}
        />
      );
    },
    [onSelectTrack]
  );

  const keyExtractor = useCallback((item: TrackEntity) => item.id, []);

  const listEmptyComponent = useMemo(() => {
    if (!hasActiveQuery) {
      return <EmptyState message={strings.searchEmpty} />;
    }

    if (isInitialLoading) {
      return <TrackSkeletonList count={6} />;
    }

    if (listError) {
      return <ErrorState message={listError} onRetry={onRetryInitial} />;
    }

    return <EmptyState message={strings.searchNoMatches} />;
  }, [hasActiveQuery, isInitialLoading, listError, onRetryInitial]);

  const listFooterComponent = useMemo(() => {
    if (isFetchingMore) {
      return <Loader size="small" />;
    }

    if (showLoadMoreHint) {
      return (
        <View style={styles.footerHint}>
          <Text style={styles.footerHintText}>
            {strings.searchScrollToLoadMore}
          </Text>
        </View>
      );
    }

    return null;
  }, [isFetchingMore, showLoadMoreHint]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>{strings.appName}</Text>
        <SearchBar
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder={strings.searchPlaceholder}
          autoFocus
        />
        <OfflineBanner visible={isOffline} />
        <FlatList
          data={tracks}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.text.primary}
              colors={[colors.text.primary]}
            />
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={listFooterComponent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.6}
          initialNumToRender={10}
          windowSize={7}
          removeClippedSubviews
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(TrackSearchScreen);

const maxWidth = SCREEN_DIMENSIONS.isTablet ? 800 : undefined;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(16),
    paddingTop: getResponsivePadding(12),
    maxWidth,
    alignSelf: "center",
    width: "100%",
  },
  heading: {
    fontSize: getResponsiveFontSize(24, 32),
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: getResponsivePadding(12),
  },
  listContent: {
    paddingVertical: getResponsivePadding(16),
    gap: getResponsivePadding(12),
    flexGrow: 1,
  },
  separator: {
    height: getResponsivePadding(12),
  },
  footerHint: {
    paddingVertical: getResponsivePadding(12),
    alignItems: "center",
  },
  footerHintText: {
    fontSize: getResponsiveFontSize(12),
    color: colors.text.tertiary,
  },
});
