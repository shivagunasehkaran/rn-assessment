import { useCallback } from "react";
import { useRouter } from "expo-router";

import { useTrackSearch } from "../src/features/tracks";
import TrackSearchScreen from "../src/screens/TrackSearchScreen";

export default function HomeScreen() {
  const router = useRouter();
  const {
    searchText,
    setSearchText,
    tracks,
    isInitialLoading,
    isFetchingMore,
    isRefreshing,
    hasActiveQuery,
    listError,
    onRetryInitial,
    onLoadMore,
    onRefresh,
    isOffline,
    showLoadMoreHint,
  } = useTrackSearch();

  const handleSelectTrack = useCallback(
    (id: string) => {
      router.push({ pathname: "/track/[id]", params: { id } });
    },
    [router]
  );

  return (
    <TrackSearchScreen
      searchText={searchText}
      onChangeSearchText={setSearchText}
      tracks={tracks}
      isInitialLoading={isInitialLoading}
      isFetchingMore={isFetchingMore}
      isRefreshing={isRefreshing}
      hasActiveQuery={hasActiveQuery}
      listError={listError}
      onRetryInitial={onRetryInitial}
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
      onSelectTrack={handleSelectTrack}
      isOffline={isOffline}
      showLoadMoreHint={showLoadMoreHint}
    />
  );
}

