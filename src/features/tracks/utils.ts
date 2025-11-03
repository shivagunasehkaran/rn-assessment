import type { ApiError } from "../../api/client";

const STATUS_PREFIX = "tracks";

export const makeListKey = (query: string, offset: number): string =>
  `${STATUS_PREFIX}:list:${query}:${offset}`;

export const makeDetailKey = (id: string): string => `${STATUS_PREFIX}:detail:${id}`;

export const mapApiErrorToMessage = (error: ApiError): string => {
  switch (error.code) {
    case "OFFLINE":
      return "You appear to be offline. Showing cached results.";
    case "TIMEOUT":
      return "The request timed out. Please try again.";
    case "RATE_LIMITED":
      return "We’re hitting Jamendo’s rate limit. Please retry in a moment.";
    case "UNAUTHORIZED":
    case "FORBIDDEN":
      return "Jamendo credentials are invalid. Check your client ID.";
    case "NOT_FOUND":
      return "We couldn’t find that track.";
    case "SERVER_ERROR":
      return "Jamendo is unavailable right now. Please try later.";
    default:
      return error.message || "Something went wrong.";
  }
};

export const SNAPSHOT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const isSnapshotFresh = (timestamp?: number): boolean => {
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp < SNAPSHOT_TTL_MS;
};

