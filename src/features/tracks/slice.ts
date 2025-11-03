import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type {
  CacheMeta,
  QueryMeta,
  RequestStatus,
  TrackDetail,
  TrackEntity,
  TracksState,
} from "./types";

export const createInitialTracksState = (): TracksState => ({
  entities: {},
  detail: {},
  pages: {},
  pageMeta: {},
  query: "",
  status: {},
  error: {},
  cacheMeta: {},
});

type StatusPayload = {
  key: string;
  status: RequestStatus;
};

type ErrorPayload = {
  key: string;
  error: string | null;
};

type MergeTracksPayload = {
  query: string;
  offset: number;
  items: TrackEntity[];
  hasMore: boolean;
};

type SetDetailPayload = {
  detail: TrackDetail;
};

type UpdatePageMetaPayload = {
  query: string;
  meta: QueryMeta;
};

type UpdateCacheMetaPayload = CacheMeta;

export const tracksSlice = createSlice({
  name: "tracks",
  initialState: createInitialTracksState(),
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearResults(state) {
      state.pages = {};
      state.pageMeta = {};
      state.status = {};
      state.error = {};
      state.cacheMeta = {};
    },
    reset: () => createInitialTracksState(),
    setStatus(state, action: PayloadAction<StatusPayload>) {
      const { key, status } = action.payload;
      state.status[key] = status;
    },
    setError(state, action: PayloadAction<ErrorPayload>) {
      const { key, error } = action.payload;
      state.error[key] = error;
    },
    mergeTracksPage(state, action: PayloadAction<MergeTracksPayload>) {
      const { query, offset, items, hasMore } = action.payload;

      items.forEach((item) => {
        state.entities[item.id] = { ...state.entities[item.id], ...item };
      });

      const pageBucket = state.pages[query] ?? {};
      pageBucket[offset] = items.map((item) => item.id);
      state.pages[query] = pageBucket;

      state.pageMeta[query] = {
        lastOffset: offset,
        hasMore,
      };
    },
    setDetail(state, action: PayloadAction<SetDetailPayload>) {
      const { detail } = action.payload;
      state.detail[detail.id] = detail;
      state.entities[detail.id] = {
        id: detail.id,
        name: detail.name,
        artistName: detail.artistName,
        audioUrl: detail.audioUrl,
        imageUrl: detail.imageUrl,
      };
    },
    updatePageMeta(state, action: PayloadAction<UpdatePageMetaPayload>) {
      const { query, meta } = action.payload;
      state.pageMeta[query] = meta;
    },
    updateCacheMeta(state, action: PayloadAction<UpdateCacheMetaPayload>) {
      state.cacheMeta = {
        ...state.cacheMeta,
        ...action.payload,
      };
    },
  },
});

export const {
  setQuery,
  clearResults,
  reset,
  setStatus,
  setError,
  mergeTracksPage,
  setDetail,
  updatePageMeta,
  updateCacheMeta,
} = tracksSlice.actions;

export default tracksSlice.reducer;

