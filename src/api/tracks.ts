import apiClient, { ApiError } from "./client";
import { JAMENDO_DEFAULT_LIMIT } from "./constants";

export interface TracksPageParams {
  query: string;
  limit?: number;
  offset?: number;
}

export interface TrackListItem {
  id: string;
  name: string;
  artistName: string;
  audioUrl: string;
  imageUrl: string | null;
}

export interface TracksPageResult {
  items: TrackListItem[];
  hasMore: boolean;
  nextOffset: number | null;
  count: number;
}

export interface TrackDetail extends TrackListItem {
  duration: number;
  albumName: string | null;
  releaseDate: string | null;
  licenseUrl: string | null;
  shareUrl: string | null;
}

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image?: string;
  album_image?: string;
  duration?: number;
  album_name?: string;
  releasedate?: string;
  license_ccurl?: string;
  shareurl?: string;
}

interface JamendoTracksResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
    results_count: number;
    next?: string | null;
  };
  results: JamendoTrack[];
}

const HOME_FIELDS = ["id", "name", "artist_name", "audio", "image", "album_image"];

const DETAIL_FIELDS = [
  "id",
  "name",
  "artist_name",
  "duration",
  "album_name",
  "releasedate",
  "license_ccurl",
  "shareurl",
  "audio",
  "image",
  "album_image",
];

const extractImageUrl = (track: JamendoTrack): string | null => {
  if (track.image) {
    return track.image;
  }

  if (track.album_image) {
    return track.album_image;
  }

  return null;
};

const mapTrackListItem = (track: JamendoTrack): TrackListItem => ({
  id: track.id,
  name: track.name,
  artistName: track.artist_name,
  audioUrl: track.audio,
  imageUrl: extractImageUrl(track),
});

export const getTracks = async ({
  query,
  limit = JAMENDO_DEFAULT_LIMIT,
  offset = 0,
}: TracksPageParams): Promise<TracksPageResult> => {
  try {
    const { data } = await apiClient.get<JamendoTracksResponse>("/tracks", {
      params: {
        namesearch: query,
        limit,
        offset,
        fields: HOME_FIELDS.join(","),
        order: "popularity_total",
      },
    });

    const count = data.headers?.results_count ?? data.results.length;
    const items = data.results.map(mapTrackListItem);
    const hasMore = count >= limit;
    const nextOffset = hasMore ? offset + limit : null;

    return {
      items,
      hasMore,
      nextOffset,
      count,
    };
  } catch (error) {
    throw error as ApiError;
  }
};

export const getTrackDetail = async (id: string): Promise<TrackDetail> => {
  try {
    const { data } = await apiClient.get<JamendoTracksResponse>("/tracks", {
      params: {
        id,
        limit: 1,
        fields: DETAIL_FIELDS.join(","),
      },
    });

    const track = data.results[0];

    if (!track) {
      const error: ApiError = {
        code: "NOT_FOUND",
        message: "Track not found.",
      };

      throw error;
    }

    const base = mapTrackListItem(track);

    return {
      ...base,
      duration: track.duration ?? 0,
      albumName: track.album_name ?? null,
      releaseDate: track.releasedate ?? null,
      licenseUrl: track.license_ccurl ?? null,
      shareUrl: track.shareurl ?? null,
    };
  } catch (error) {
    throw error as ApiError;
  }
};


