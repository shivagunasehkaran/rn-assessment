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
    ({ item }: { item: TrackEntity }) => (
      <TrackCard
        title={item.name}
        artist={item.artistName}
        imageUrl={item.imageUrl}
        onPress={() => onSelectTrack(item.id)}
      />
    ),
    [onSelectTrack]
  );

  const keyExtractor = useCallback((item: TrackEntity) => item.id, []);

  const listEmptyComponent = useMemo(() => {
    if (!hasActiveQuery) {
      return <EmptyState message="Search tracks to get started." />;
    }

    if (isInitialLoading) {
      return <TrackSkeletonList count={6} />;
    }

    if (listError) {
      return <ErrorState message={listError} onRetry={onRetryInitial} />;
    }

    return <EmptyState message="No matches. Try a different search." />;
  }, [hasActiveQuery, isInitialLoading, listError, onRetryInitial]);

  const listFooterComponent = useMemo(() => {
    if (isFetchingMore) {
      return <Loader size="small" />;
    }

    if (showLoadMoreHint) {
      return (
        <View style={styles.footerHint}>
          <Text style={styles.footerHintText}>Scroll to load more</Text>
        </View>
      );
    }

    return null;
  }, [isFetchingMore, showLoadMoreHint]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Jamendo Tracks</Text>
        <SearchBar
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder="Search tracks..."
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
              tintColor="#111827"
              colors={["#111827"]}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  listContent: {
    paddingVertical: 16,
    gap: 12,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  footerHint: {
    paddingVertical: 12,
    alignItems: "center",
  },
  footerHintText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

