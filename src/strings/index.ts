export const strings = {
  // App
  appName: "Jamendo Tracks",

  // Search
  searchPlaceholder: "Search tracks...",
  searchEmpty: "Search tracks to get started.",
  searchNoMatches: "No matches. Try a different search.",
  searchScrollToLoadMore: "Scroll to load more",

  // Track Detail
  trackDetailTitle: "Track Info",
  trackDetailNotFound: "Track not found.",
  trackDetailRefreshing: "Refreshing track details…",
  trackDetailBack: "‹ Back",
  trackDetailMetadata: {
    album: "Album",
    duration: "Duration",
    released: "Released",
  },
  trackDetailActions: {
    viewLicense: "View License",
    openOnJamendo: "Open on Jamendo",
  },

  // Player
  playerUnavailable: "Audio playback unavailable",
  playerUnavailableSubtitle: "Create a development build to enable the Jamendo player.",
  playerPlay: "Play",
  playerPause: "Pause",
  playerPlayLabel: "Play track",
  playerPauseLabel: "Pause playback",
  playerSeekBack: "« 15s",
  playerSeekForward: "15s »",
  playerSeekBackLabel: "Seek backward",
  playerSeekForwardLabel: "Seek forward",

  // Common
  retry: "Retry",
  clearSearch: "Clear search text",

  // Errors
  error: {
    offline: "You appear to be offline. Showing cached results.",
    timeout: "The request timed out. Please try again.",
    rateLimited: "We're hitting Jamendo's rate limit. Please retry in a moment.",
    unauthorized: "Jamendo credentials are invalid. Check your client ID.",
    forbidden: "Jamendo credentials are invalid. Check your client ID.",
    notFound: "We couldn't find that track.",
    serverError: "Jamendo is unavailable right now. Please try later.",
    unknown: "Something went wrong.",
  },

  // Offline
  offlineBanner: "You are offline. Showing cached results.",
} as const;

export type Strings = typeof strings;

export default strings;

