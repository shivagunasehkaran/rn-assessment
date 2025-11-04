import type { ApiError } from "../../api/client";
import { strings } from "../../strings";

const STATUS_PREFIX = "tracks";

export const makeListKey = (query: string, offset: number): string =>
  `${STATUS_PREFIX}:list:${query}:${offset}`;

export const makeDetailKey = (id: string): string => `${STATUS_PREFIX}:detail:${id}`;

export const mapApiErrorToMessage = (error: ApiError): string => {
  switch (error.code) {
    case "OFFLINE":
      return strings.error.offline;
    case "TIMEOUT":
      return strings.error.timeout;
    case "RATE_LIMITED":
      return strings.error.rateLimited;
    case "UNAUTHORIZED":
    case "FORBIDDEN":
      return strings.error.unauthorized;
    case "NOT_FOUND":
      return strings.error.notFound;
    case "SERVER_ERROR":
      return strings.error.serverError;
    default:
      return error.message || strings.error.unknown;
  }
};

export const SNAPSHOT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const isSnapshotFresh = (timestamp?: number): boolean => {
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp < SNAPSHOT_TTL_MS;
};

