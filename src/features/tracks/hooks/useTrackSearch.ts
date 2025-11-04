import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

import { JAMENDO_DEFAULT_LIMIT } from "../../../api/constants";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectCurrentQuery,
  selectErrorByKey,
  selectPaginationMetaByQuery,
  selectStatusByKey,
  selectTrackIdsByQuery,
  selectTracksByQuery,
} from "../selectors";
import { tracksThunks } from "../thunks";
import { makeListKey } from "../utils";
import type { TrackEntity } from "../types";

type UseTrackSearchResult = {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  tracks: TrackEntity[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  hasActiveQuery: boolean;
  listError: string | null;
  onRetryInitial: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  isOffline: boolean;
  showLoadMoreHint: boolean;
};

export function useTrackSearch(): UseTrackSearchResult {
  const dispatch = useAppDispatch();
  const netInfo = useNetInfo();

  const storedQuery = useAppSelector(selectCurrentQuery);
  const [searchText, setSearchText] = useState(storedQuery ?? "");
  const debouncedQuery = useDebouncedValue(searchText, 300);

  useEffect(() => {
    setSearchText(storedQuery ?? "");
  }, [storedQuery]);

  const trimmedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);
  const hasActiveQuery = trimmedQuery.length > 0;
  const lastFetchedQueryRef = useRef<string>("");

  useEffect(() => {
    if (!trimmedQuery) {
      if (storedQuery !== "") {
        dispatch(tracksThunks.updateSearchQuery("", true));
        lastFetchedQueryRef.current = "";
      }
      return;
    }

    // Only fetch if debounced query changed AND we haven't already fetched this query
    if (
      trimmedQuery !== storedQuery &&
      trimmedQuery !== lastFetchedQueryRef.current
    ) {
      lastFetchedQueryRef.current = trimmedQuery;
      dispatch(tracksThunks.updateSearchQuery(trimmedQuery, true));
      dispatch(
        tracksThunks.fetchTracksPage({
          query: trimmedQuery,
          offset: 0,
          limit: JAMENDO_DEFAULT_LIMIT,
          force: true,
        })
      );
    }
  }, [trimmedQuery, storedQuery, dispatch]);

  // Batch selectors to reduce re-renders - use separate selectors but memoize
  const trackIds = useAppSelector((state) =>
    selectTrackIdsByQuery(state, storedQuery)
  );
  const tracks = useAppSelector((state) =>
    selectTracksByQuery(state, storedQuery)
  );
  const paginationMeta = useAppSelector((state) =>
    selectPaginationMetaByQuery(state, storedQuery)
  );
  const listKey = useMemo(() => makeListKey(storedQuery, 0), [storedQuery]);
  const listStatus = useAppSelector((state) =>
    selectStatusByKey(state, listKey)
  );
  const listError = useAppSelector((state) => selectErrorByKey(state, listKey));

  const nextOffset = useMemo(
    () =>
      paginationMeta.lastOffset >= 0
        ? paginationMeta.lastOffset + JAMENDO_DEFAULT_LIMIT
        : 0,
    [paginationMeta.lastOffset]
  );
  const nextKey = useMemo(
    () => makeListKey(storedQuery, nextOffset),
    [storedQuery, nextOffset]
  );
  const nextStatus = useAppSelector((state) =>
    selectStatusByKey(state, nextKey)
  );

  const { offsets, hasMore } = paginationMeta;
  const isInitialLoading =
    listStatus === "loading" && trackIds.length === 0 && hasActiveQuery;
  const isRefreshing = listStatus === "loading" && trackIds.length > 0;
  const isFetchingMore = hasMore && nextStatus === "loading";

  const isOffline = useMemo(
    () =>
      netInfo.isConnected === false || netInfo.isInternetReachable === false,
    [netInfo.isConnected, netInfo.isInternetReachable]
  );

  const handleRetryInitial = useCallback(() => {
    if (!trimmedQuery) {
      return;
    }

    dispatch(
      tracksThunks.fetchTracksPage({
        query: trimmedQuery,
        offset: 0,
        limit: JAMENDO_DEFAULT_LIMIT,
        force: true,
      })
    );
  }, [dispatch, trimmedQuery]);

  const loadingMoreRef = useRef(false);

  useEffect(() => {
    // Reset loading ref when fetching completes
    if (!isFetchingMore) {
      loadingMoreRef.current = false;
    }
  }, [isFetchingMore]);

  const handleLoadMore = useCallback(() => {
    if (!trimmedQuery || !hasMore || isFetchingMore || loadingMoreRef.current) {
      return;
    }

    loadingMoreRef.current = true;
    dispatch(
      tracksThunks.fetchTracksPage({
        query: trimmedQuery,
        offset: nextOffset,
        limit: JAMENDO_DEFAULT_LIMIT,
      })
    );
  }, [dispatch, trimmedQuery, hasMore, isFetchingMore, nextOffset]);

  const handleRefresh = useCallback(() => {
    if (!trimmedQuery) {
      return;
    }

    dispatch(
      tracksThunks.fetchTracksPage({
        query: trimmedQuery,
        offset: 0,
        limit: JAMENDO_DEFAULT_LIMIT,
        force: true,
      })
    );
  }, [dispatch, trimmedQuery]);

  const showLoadMoreHint = hasMore && offsets.length > 0;

  return {
    searchText,
    setSearchText,
    tracks,
    isInitialLoading,
    isRefreshing,
    isFetchingMore,
    hasActiveQuery,
    listError,
    onRetryInitial: handleRetryInitial,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
    isOffline,
    showLoadMoreHint,
  };
}

export default useTrackSearch;
