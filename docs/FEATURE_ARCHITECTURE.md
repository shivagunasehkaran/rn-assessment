# Jamendo Tracks Feature - Architecture & Flow Documentation

## Overview

This document explains how the Jamendo music search and playback feature works, focusing on user interactions, API calls, state management, and data flow.

---

## 1. Search Flow (Typing & API Calls)

### How Search Works

1. **User Types in Search Bar**

   - Each character typed updates the local input state immediately (for UI responsiveness)
   - The search text is debounced with a 300ms delay

2. **Debouncing Logic**

   - When user types "shiva":
     - Types "s" → waits 300ms
     - Types "h" (within 300ms) → resets timer, waits 300ms
     - Types "i" (within 300ms) → resets timer, waits 300ms
     - Types "v" (within 300ms) → resets timer, waits 300ms
     - Types "a" (within 300ms) → resets timer, waits 300ms
     - **After 300ms of no typing** → API call is triggered with "shiva"

3. **API Call Trigger**

   - API is called **only once** after the user stops typing for 300ms
   - If user types with spaces between characters (e.g., types "s", waits 1 second, types "h"):
     - First debounce completes → API called with "s"
     - After typing "h", another 300ms wait → API called with "sh"
   - **Key Point**: API is NOT called for every character. It's called once per debounced query change.

4. **Duplicate Prevention**
   - A ref guard tracks the last fetched query
   - If the same query is already fetched, no duplicate API call is made
   - This prevents redundant requests when Redux state updates cause re-renders

---

## 2. Pagination & Infinite Scroll Flow

### Initial Load

1. **First Search**
   - User searches "shiva" → API called with:
     - `limit=20` (number of tracks per page)
     - `offset=0` (starting from the first track)
   - Redux stores: 20 track IDs in `pages["shiva"][0]` and normalized track entities

### Scroll to Load More

1. **User Scrolls Down**

   - When user scrolls to 60% of the list (`onEndReachedThreshold=0.6`), `onEndReached` fires
   - A ref guard prevents multiple rapid triggers

2. **Load More Logic**

   - Checks if there are more tracks (`hasMore` from previous response)
   - Calculates next offset: `lastOffset + limit` (e.g., 0 + 20 = 20)
   - API called with:
     - Same query: "shiva"
     - `offset=20` (next page)
     - `limit=20`
   - Redux appends: 20 new track IDs in `pages["shiva"][20]` and merges entities

3. **Offset Progression**

   - First page: `offset=0` → tracks 1-20
   - Second page: `offset=20` → tracks 21-40
   - Third page: `offset=40` → tracks 41-60
   - And so on...

4. **When to Stop**
   - API response includes `hasMore: false` when no more tracks available
   - Scroll loading stops automatically
   - Footer shows "Scroll to load more" hint only when `hasMore=true`

### Data Structure in Redux

- `pages["shiva"]` = `{ 0: [id1, id2, ...], 20: [id21, id22, ...] }`
- `entities` = `{ id1: {track data}, id2: {track data}, ... }` (normalized)
- Selectors combine pages to return ordered array of tracks

---

## 3. Track Detail Screen Flow

### Navigation to Detail

1. **User Clicks Track Card**
   - Track ID is passed via navigation params (e.g., `/track/123456`)
   - **No API call at this point** - just navigation

### Detail Screen Mount

1. **On Screen Mount**

   - Screen extracts track ID from route params
   - Dispatches `fetchTrackDetail({ id })` action

2. **API Call Strategy**

   - **First-time visit**: API called to fetch full track details
   - **Cached check**: If track detail already exists in Redux and is fresh, API may be skipped (if we implement caching TTL)
   - **Current behavior**: API is called every time (for simplicity)

3. **Data Sources**

   - **Track basic info**: Already in Redux `entities[id]` from search results
   - **Track detailed info**: Fetched via API and stored in `detail[id]`
   - UI combines both: uses `entities[id]` for immediate render, `detail[id]` for extended metadata

4. **Props vs API**
   - **NOT props drilling**: Each screen fetches what it needs from Redux
   - Detail screen uses Redux selectors to get track + detail
   - If track not in Redux (edge case), detail fetch also populates basic entity

---

## 4. Redux State Updates from API

### API Response Flow

1. **API Call Made**

   - Thunk (async action) dispatches API request via Axios
   - Redux status updated: `status["query:0"] = "loading"`

2. **Success Response**

   - API returns array of tracks
   - Thunk dispatches `mergeTracksPage` action with:
     - Query string
     - Offset (page number)
     - Track items array
     - `hasMore` boolean

3. **Redux State Updates**

   - **Normalized Storage**:
     - Each track stored in `entities[trackId]` (normalized - no duplicates)
     - If same track appears in multiple searches, it's updated, not duplicated
   - **Page Organization**:
     - Track IDs stored in `pages[query][offset]` = `[id1, id2, ...]`
     - This maintains page order
   - **Metadata**:
     - `pageMeta[query]` = `{ lastOffset: 20, hasMore: true }`
     - `status["query:0"]` = `"succeeded"`
     - `error["query:0"]` = `null`

4. **Selectors Derive Data**
   - `selectTrackIdsByQuery("shiva")` → combines all pages `[0, 20]` → returns ordered IDs
   - `selectTracksByQuery("shiva")` → maps IDs to entities → returns full track objects array
   - Components subscribe to selectors and re-render when data changes

### Error Handling

- On API failure: `status["query:0"]` = `"failed"`, `error["query:0"]` = error message
- UI shows error state with retry button
- Retry dispatches same thunk again

---

## 5. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│  (Screens: TrackSearchScreen, TrackDetailScreen)            │
│  (Components: TrackCard, TrackPlayer, SearchBar, etc.)      │
└──────────────────────┬──────────────────────────────────────┘
                       │ Props (data + callbacks)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Custom Hooks Layer                         │
│  (useTrackSearch, useTrackDetail, useTrackPlayer)            │
│  - Encapsulates business logic                               │
│  - Manages side effects (API calls, debouncing)             │
│  - Returns data + callbacks for UI                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ Dispatches actions, reads selectors
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Redux Store Layer                          │
│  - Slice: tracks state (entities, pages, query, status)     │
│  - Thunks: Async API calls (fetchTracksPage, fetchTrackDetail)│
│  - Selectors: Derived data (selectTracksByQuery, etc.)      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP requests
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
│  - Axios client with interceptors                           │
│  - Error parsing and transformation                         │
│  - Jamendo API integration                                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Separation of Concerns**

   - **UI Layer**: Pure presentational components (no business logic)
   - **Hooks Layer**: Business logic and state management coordination
   - **Redux Layer**: Centralized state and API orchestration
   - **API Layer**: Network requests and error handling

2. **Single Source of Truth (Redux)**

   - All track data lives in Redux store
   - Components read from Redux via selectors
   - No local state for data (except UI-specific like input text)

3. **Normalized Data Structure**

   - Tracks stored by ID in `entities` (prevents duplicates)
   - Pages store only IDs (references to entities)
   - Selectors combine pages + entities to return arrays

4. **Feature-Based Organization**

   - All track-related code in `src/features/tracks/`
   - Includes: types, slice, thunks, selectors, hooks
   - Self-contained and reusable

5. **Offline Support**
   - Redux-persist caches state to AsyncStorage
   - On app restart, cached data is restored
   - Offline banner shows when network unavailable
   - API calls fail gracefully with cached data shown

### Data Flow Example: User Searches "shiva"

1. **User types "shiva"** → Input state updates
2. **300ms debounce** → `useTrackSearch` hook triggers
3. **Hook dispatches** → `updateSearchQuery("shiva")` + `fetchTracksPage({ query: "shiva", offset: 0 })`
4. **Thunk executes** → API call: `GET /tracks?namesearch=shiva&limit=20&offset=0`
5. **API responds** → Thunk dispatches `mergeTracksPage` with tracks
6. **Redux updates** → `entities`, `pages["shiva"][0]`, `pageMeta` updated
7. **Selectors re-compute** → `selectTracksByQuery("shiva")` returns new array
8. **Hook re-renders** → `tracks` prop updates
9. **Screen re-renders** → `TrackSearchScreen` shows track list

### Data Flow Example: User Scrolls to Load More

1. **User scrolls** → Reaches 60% of list
2. **FlatList triggers** → `onEndReached` fires
3. **Hook receives** → `onLoadMore` callback called
4. **Hook checks** → `hasMore=true`, `nextOffset=20`
5. **Hook dispatches** → `fetchTracksPage({ query: "shiva", offset: 20 })`
6. **Thunk executes** → API call: `GET /tracks?namesearch=shiva&limit=20&offset=20`
7. **API responds** → Thunk dispatches `mergeTracksPage` with next 20 tracks
8. **Redux updates** → `pages["shiva"][20]` added, `entities` merged
9. **Selectors re-compute** → Returns combined array of 40 tracks
10. **Screen re-renders** → Shows all 40 tracks

### Data Flow Example: User Clicks Track

1. **User clicks track card** → `onSelectTrack(trackId)` called
2. **Navigation** → Router pushes `/track/[id]` with track ID
3. **Detail screen mounts** → Extracts ID from params
4. **Hook dispatches** → `fetchTrackDetail({ id })`
5. **Thunk executes** → API call: `GET /tracks/{id}`
6. **API responds** → Thunk dispatches `setDetail` with full track detail
7. **Redux updates** → `detail[id]` and `entities[id]` updated
8. **Selectors re-compute** → `selectDetailById(id)` returns detail
9. **Screen re-renders** → Shows track detail with player

---

## 6. Key Design Decisions

### Why Redux?

- **Offline support**: Redux-persist enables caching
- **Normalized state**: Prevents duplicate data
- **Time-travel debugging**: Redux DevTools
- **Predictable state**: Single source of truth

### Why Custom Hooks?

- **Testability**: Business logic separated from UI
- **Reusability**: Same hook can power different UIs
- **Clean components**: UI components are pure and simple

### Why Debouncing?

- **API efficiency**: Reduces unnecessary API calls
- **Better UX**: User can type freely without lag
- **Cost savings**: Fewer API requests = lower rate limit usage

### Why Normalized Data?

- **No duplicates**: Same track in multiple searches stored once
- **Easy updates**: Update track in one place, reflects everywhere
- **Memory efficient**: References instead of copies

### Why Page-Based Pagination?

- **Incremental loading**: Load 20 at a time, not all at once
- **Memory efficient**: Only loaded pages in memory
- **Better performance**: Smaller initial payload

---

## Summary

The feature follows a clean, scalable architecture:

- **User input** → Debounced → **API call** → **Redux update** → **Selector** → **UI render**
- **Scroll** → **Load more API** → **Redux append** → **UI update**
- **Track click** → **Navigate** → **Fetch detail API** → **Redux update** → **UI render**

All data flows through Redux as the single source of truth, ensuring consistency, offline support, and easy debugging.
