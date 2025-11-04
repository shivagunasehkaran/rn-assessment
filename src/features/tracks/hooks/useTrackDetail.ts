import { useCallback, useEffect, useMemo } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { TrackDetail, TrackEntity } from "../types";
import {
  selectDetailById,
  selectErrorByKey,
  selectStatusByKey,
  selectTrackById,
} from "../selectors";
import { tracksThunks } from "../thunks";
import { makeDetailKey } from "../utils";

type UseTrackDetailResult = {
  track: TrackEntity | TrackDetail | undefined;
  detail: TrackDetail | undefined;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isOffline: boolean;
  refetch: () => void;
};

export function useTrackDetail(id?: string): UseTrackDetailResult {
  const dispatch = useAppDispatch();
  const netInfo = useNetInfo();

  const detailKey = useMemo(() => (id ? makeDetailKey(id) : null), [id]);

  const detail = useAppSelector((state) =>
    id ? selectDetailById(state, id) : undefined
  );
  const summary = useAppSelector((state) =>
    id ? selectTrackById(state, id) : undefined
  );

  const status = useAppSelector((state) =>
    detailKey ? selectStatusByKey(state, detailKey) : "idle"
  );

  const error = useAppSelector((state) =>
    detailKey ? selectErrorByKey(state, detailKey) : null
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(tracksThunks.fetchTrackDetail({ id }));
  }, [dispatch, id]);

  const isOffline =
    netInfo.isConnected === false || netInfo.isInternetReachable === false;

  const refetch = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(tracksThunks.fetchTrackDetail({ id, force: true }));
  }, [dispatch, id]);

  const isLoading = status === "loading" && !detail;
  const isRefreshing = status === "loading" && !!detail;

  return {
    track: detail ?? summary,
    detail: detail ?? undefined,
    isLoading,
    isRefreshing,
    error,
    isOffline,
    refetch,
  };
}

export default useTrackDetail;
