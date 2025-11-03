import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../store";
import type { RequestStatus, TrackDetail, TrackEntity } from "./types";

const selectTracksState = (state: RootState) => state.tracks;

export const selectCurrentQuery = (state: RootState): string => selectTracksState(state).query;

export const selectTrackById = createSelector(
  [selectTracksState, (_: RootState, id: string) => id],
  (tracksState, id): TrackEntity | undefined => tracksState.entities[id]
);

export const selectDetailById = createSelector(
  [selectTracksState, (_: RootState, id: string) => id],
  (tracksState, id): TrackDetail | undefined => tracksState.detail[id]
);

export const selectTrackIdsByQuery = createSelector(
  [selectTracksState, (_: RootState, query: string) => query],
  (tracksState, query): string[] => {
    const pages = tracksState.pages[query];
    if (!pages) {
      return [];
    }

    const offsets = Object.keys(pages)
      .map((offsetKey) => Number(offsetKey))
      .sort((a, b) => a - b);

    const orderedIds: string[] = [];
    offsets.forEach((offset) => {
      const ids = pages[offset];
      ids?.forEach((id) => {
        if (!orderedIds.includes(id)) {
          orderedIds.push(id);
        }
      });
    });

    return orderedIds;
  }
);

export const selectHasMoreByQuery = createSelector(
  [selectTracksState, (_: RootState, query: string) => query],
  (tracksState, query): boolean => tracksState.pageMeta[query]?.hasMore ?? false
);

export const selectStatusByKey = createSelector(
  [selectTracksState, (_: RootState, key: string) => key],
  (tracksState, key): RequestStatus => tracksState.status[key] ?? "idle"
);

export const selectErrorByKey = createSelector(
  [selectTracksState, (_: RootState, key: string) => key],
  (tracksState, key): string | null => tracksState.error[key] ?? null
);

export const selectCacheMeta = (state: RootState) => selectTracksState(state).cacheMeta;

