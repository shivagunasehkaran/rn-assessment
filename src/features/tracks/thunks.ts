import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

import type { ApiError } from "../../api/client";
import { getTrackDetail, getTracks } from "../../api/tracks";
import type { AppThunk } from "../../store";
import {
  clearResults,
  mergeTracksPage,
  setDetail,
  setError,
  setStatus,
  setQuery,
  updateCacheMeta,
} from "./slice";
import type {
  FetchTrackDetailParams,
  FetchTracksPageParams,
  TracksState,
} from "./types";
import {
  isSnapshotFresh,
  makeDetailKey,
  makeListKey,
  mapApiErrorToMessage,
} from "./utils";

const isOffline = (netState: NetInfoState): boolean => {
  if (netState.isConnected === false) {
    return true;
  }

  if (netState.isInternetReachable === false) {
    return true;
  }

  return false;
};

const getTracksState = (state: { tracks: TracksState }): TracksState => state.tracks;

export const updateSearchQuery = (query: string, resetResults = false): AppThunk =>
  (dispatch) => {
    dispatch(setQuery(query));

    if (resetResults) {
      dispatch(clearResults());
    }
  };

export const fetchTracksPage = ({
  query,
  limit,
  offset = 0,
  force = false,
}: FetchTracksPageParams): AppThunk =>
  async (dispatch, getState) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      dispatch(clearResults());
      return;
    }

    const key = makeListKey(trimmedQuery, offset);
    const state = getTracksState(getState());

    if (!force) {
      if (state.status[key] === "loading") {
        return;
      }

      const existingPage = state.pages[trimmedQuery]?.[offset];
      if (existingPage && existingPage.length > 0) {
        return;
      }
    }

    const netState = await NetInfo.fetch();
    const offline = isOffline(netState);

    if (offline) {
      dispatch(
        setError({
          key,
          error: "You appear to be offline. Showing cached results.",
        })
      );
      dispatch(setStatus({ key, status: "failed" }));
      return;
    }

    dispatch(setStatus({ key, status: "loading" }));
    dispatch(setError({ key, error: null }));

    try {
      const result = await getTracks({
        query: trimmedQuery,
        limit,
        offset,
      });

      dispatch(
        mergeTracksPage({
          query: trimmedQuery,
          offset,
          items: result.items,
          hasMore: result.hasMore,
        })
      );

      if (offset === 0) {
        dispatch(
          updateCacheMeta({
            lastQuery: trimmedQuery,
            snapshotAt: Date.now(),
          })
        );
      }

      dispatch(setStatus({ key, status: "succeeded" }));
      dispatch(setError({ key, error: null }));
    } catch (unknownError) {
      const error = unknownError as ApiError;
      dispatch(setStatus({ key, status: "failed" }));
      dispatch(
        setError({
          key,
          error: mapApiErrorToMessage(error),
        })
      );
    }
  };

export const fetchTrackDetail = ({ id, force = false }: FetchTrackDetailParams): AppThunk =>
  async (dispatch, getState) => {
    const key = makeDetailKey(id);
    const state = getTracksState(getState());

    if (!force) {
      if (state.status[key] === "loading") {
        return;
      }

      if (state.detail[id]) {
        return;
      }
    }

    const netState = await NetInfo.fetch();
    const offline = isOffline(netState);

    if (offline) {
      dispatch(
        setError({
          key,
          error: "You appear to be offline. Showing cached details if available.",
        })
      );
      dispatch(setStatus({ key, status: "failed" }));
      return;
    }

    dispatch(setStatus({ key, status: "loading" }));
    dispatch(setError({ key, error: null }));

    try {
      const detail = await getTrackDetail(id);
      dispatch(setDetail({ detail }));
      dispatch(setStatus({ key, status: "succeeded" }));
      dispatch(setError({ key, error: null }));
    } catch (unknownError) {
      const error = unknownError as ApiError;
      dispatch(setStatus({ key, status: "failed" }));
      dispatch(
        setError({
          key,
          error: mapApiErrorToMessage(error),
        })
      );
    }
  };

export const hydrateTracksFromSnapshot = (): AppThunk => (dispatch, getState) => {
  const { cacheMeta, query } = getTracksState(getState());
  const lastQuery = cacheMeta.lastQuery ?? query;

  if (!lastQuery) {
    return;
  }

  if (!isSnapshotFresh(cacheMeta.snapshotAt)) {
    dispatch(clearResults());
    return;
  }

  dispatch(setQuery(lastQuery));
};

export const tracksThunks = {
  fetchTracksPage,
  fetchTrackDetail,
  updateSearchQuery,
  hydrateTracksFromSnapshot,
};

export type TracksThunks = typeof tracksThunks;

