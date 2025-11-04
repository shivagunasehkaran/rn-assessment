import { useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useTrackDetail } from "../../src/features/tracks";
import TrackDetailScreen from "../../src/screens/TrackDetailScreen";

export default function TrackDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();

  const trackId = useMemo(() => {
    if (Array.isArray(id)) {
      return id[0];
    }
    return id ?? undefined;
  }, [id]);

  const { track, detail, isLoading, isRefreshing, error, isOffline, refetch } =
    useTrackDetail(trackId);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <TrackDetailScreen
      track={track}
      detail={detail}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error}
      isOffline={isOffline}
      onRetry={refetch}
      onBack={handleBack}
    />
  );
}

