import type { TrackDetail as ApiTrackDetail, TrackListItem } from "../../api/tracks";

export type TrackEntity = TrackListItem;

export interface TrackDetail extends ApiTrackDetail {}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface QueryPageState {
  [offset: string]: string[];
}

export interface QueryMeta {
  lastOffset: number;
  hasMore: boolean;
}

export interface CacheMeta {
  lastQuery?: string;
  snapshotAt?: number;
}

export interface TracksState {
  entities: Record<string, TrackEntity>;
  detail: Record<string, TrackDetail | undefined>;
  pages: Record<string, QueryPageState>;
  pageMeta: Record<string, QueryMeta | undefined>;
  query: string;
  status: Record<string, RequestStatus>;
  error: Record<string, string | null>;
  cacheMeta: CacheMeta;
}

export interface FetchTracksPageParams {
  query: string;
  limit?: number;
  offset?: number;
  force?: boolean;
}

export interface FetchTrackDetailParams {
  id: string;
  force?: boolean;
}

