import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  createTransform,
  persistReducer,
  persistStore,
  type PersistConfig,
} from "redux-persist";

import rootReducer from "./rootReducer";
import { createInitialTracksState } from "../features/tracks/slice";
import type { TracksState } from "../features/tracks/types";
import { isSnapshotFresh } from "../features/tracks/utils";

const tracksTransform = createTransform<TracksState, TracksState>(
  (inbound) => {
    const base = createInitialTracksState();
    const lastQuery = inbound.cacheMeta.lastQuery;
    if (!lastQuery) {
      return {
        ...base,
        query: inbound.query,
      };
    }

    const firstPageIds = inbound.pages[lastQuery]?.[0] ?? [];
    const prunedEntities: TracksState["entities"] = {};
    firstPageIds.forEach((id) => {
      const entity = inbound.entities[id];
      if (entity) {
        prunedEntities[id] = entity;
      }
    });

    return {
      ...base,
      entities: prunedEntities,
      pages: firstPageIds.length
        ? {
            [lastQuery]: {
              0: firstPageIds,
            },
          }
        : {},
      pageMeta: inbound.pageMeta[lastQuery]
        ? { [lastQuery]: inbound.pageMeta[lastQuery] }
        : {},
      query: inbound.query,
      cacheMeta: {
        lastQuery,
        snapshotAt: inbound.cacheMeta.snapshotAt,
      },
    };
  },
  (outbound) => {
    if (!isSnapshotFresh(outbound.cacheMeta.snapshotAt)) {
      return createInitialTracksState();
    }

    return outbound;
  },
  { whitelist: ["tracks"] }
);

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["tracks"],
  transforms: [tracksTransform],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;

export default store;

