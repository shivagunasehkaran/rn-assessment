import axios, { AxiosError, AxiosInstance } from "axios";
import { JAMENDO_BASE_URL } from "./constants";

const clientId = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

if (__DEV__ && !clientId) {
  // eslint-disable-next-line no-console
  console.warn(
    "EXPO_PUBLIC_JAMENDO_CLIENT_ID is not set. Jamendo API requests will fail until it is provided."
  );
}

export type ApiErrorCode =
  | "OFFLINE"
  | "TIMEOUT"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: string;
  original?: unknown;
}

export const parseError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error_message?: string;
    }>;
    const status = axiosError.response?.status;
    const jamendoMessage =
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error_message;

    if (axiosError.code === "ECONNABORTED") {
      return {
        code: "TIMEOUT",
        message:
          "The request took too long. Please check your connection and try again.",
        status,
        original: error,
      };
    }

    if (!axiosError.response) {
      return {
        code: "OFFLINE",
        message: "No internet connection. Showing cached data when available.",
        original: error,
      };
    }

    if (status === 429) {
      return {
        code: "RATE_LIMITED",
        message: "Jamendo rate limit reached. Please wait a moment and retry.",
        status,
        original: error,
      };
    }

    if (status === 401) {
      return {
        code: "UNAUTHORIZED",
        message: "Jamendo credentials are invalid or missing.",
        status,
        original: error,
      };
    }

    if (status === 403) {
      return {
        code: "FORBIDDEN",
        message: "You do not have access to this resource.",
        status,
        original: error,
      };
    }

    if (status === 404) {
      return {
        code: "NOT_FOUND",
        message: "We could not find what you were looking for.",
        status,
        original: error,
      };
    }

    if (status && status >= 500) {
      return {
        code: "SERVER_ERROR",
        message: "Jamendo is currently unavailable. Please try again later.",
        status,
        original: error,
      };
    }

    return {
      code: "UNKNOWN",
      message:
        jamendoMessage ||
        "Something went wrong while communicating with Jamendo.",
      status,
      original: error,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
      original: error,
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred.",
    original: error,
  };
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: JAMENDO_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const params = {
    format: "json",
    ...(config.params ?? {}),
  } as Record<string, unknown>;

  if (clientId) {
    params.client_id = clientId;
  }

  return {
    ...config,
    params,
  };
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(parseError(error))
);

export default apiClient;
