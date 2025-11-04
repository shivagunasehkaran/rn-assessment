# Jamendo Tracks

A React Native music search app built with Expo. Search Jamendo's royalty-free music catalog, browse results, and play tracks with a built-in audio player.

## What It Does

Search for music tracks, scroll through results, tap a track to see details and play it. Works offline with cached results, handles errors gracefully, and aims for smooth 60 FPS performance.

## Features

- Search tracks with debounced input (waits for you to stop typing)
- Infinite scroll pagination
- Track detail view with metadata
- Audio player with play/pause and seek controls
- Offline support with cached data
- Error states with retry options
- Optimized for performance

## Platform Requirements

### Minimum OS Versions
- **iOS**: iOS 13.0 or later (supports iPhone and iPad)
- **Android**: Android 8.0 (API level 26) or later

### Screen Sizes
The app is responsive and optimized for:
- **Phones**: All screen sizes (375px and above)
- **Tablets**: 
  - iPad (768px+ width)
  - Android tablets (600px+ width)
- **Layout**: Content max-width of 800px on tablets for optimal readability

### Orientation
- **Portrait mode only** (landscape not supported)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- Jamendo API Client ID ([Get one here](https://developer.jamendo.com/))

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd rn-assessment
   npm install
   ```

2. **Configure API key**
   - Create a `.env` file in the root directory
   - Add your Jamendo client ID:
     ```
     EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
     ```

3. **Run the app**
   ```bash
   npm start
   ```
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (limited functionality - native modules require dev build)

4. **For full functionality** (audio playback):
   ```bash
   npm run ios
   # or
   npm run android
   ```
   This creates a development build with native module support.

## Packages Used

### Core Framework
- `expo` (~54.0.20) - Expo SDK
- `react-native` (0.81.5) - React Native
- `react` (19.1.0) - React
- `expo-router` - File-based routing
- `typescript` - Type checking

### State Management
- `@reduxjs/toolkit` - Redux with modern patterns
- `react-redux` - React bindings
- `redux-persist` - State persistence

### Networking & Storage
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage (future: MMKV)

### UI & Utilities
- `react-native-safe-area-context` - Safe area handling
- `@react-native-community/netinfo` - Network detection
- `expo-status-bar` - Status bar component

### Audio
- `react-native-audio-pro` - Audio playback (requires dev build)

### Testing
- `jest` + `jest-expo` - Test framework
- `@testing-library/react-native` - Component testing
- `react-test-renderer` - React testing utilities

## Thinking & Decisions

**Why Redux?**
Went with Redux for offline support and normalized state. Could have used Context API or Zustand for this demo, but based on requirement Redux should be used heavily:
- Persistent caching across app restarts
- Normalized data to avoid duplicates
- Time-travel debugging during development

**Why Custom Hooks?**
Separated business logic into hooks (`useTrackSearch`, `useTrackDetail`, `useTrackPlayer`) so UI components stay simple. Makes testing easier - test the hook, mock the UI.

**Why Expo Router?**
File-based routing is simpler than React Navigation for this scope. Deep linking works out of the box, and the structure is easy to understand.

**Performance Choices**
- 300ms debounce on search to reduce API calls
- Memoized Redux selectors to prevent re-renders
- FlatList optimizations for smooth scrolling
- Ref guards to prevent duplicate API calls

**Offline Strategy**
Redux-persist caches the last successful search. When offline, you see cached results with a banner. Works well for demo purposes.

### Folder Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable UI components
├── features/         # Feature-based modules (tracks)
│   └── tracks/
│       ├── hooks/    # Business logic hooks
│       ├── selectors.ts
│       ├── slice.ts
│       └── thunks.ts
├── screens/          # Screen components (presentational)
├── store/            # Redux store configuration
├── theme/            # Colors (fonts/spacing to come)
├── strings/          # All user-facing text
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Project Quality

### Architecture & Approach
- Redux as single source of truth for all track data
- Custom hooks separate business logic from UI components
- Feature-based folder structure for maintainability
- Normalized data structure prevents duplicates
- Page-based pagination for efficient memory usage

### Code Readability & Style
- TypeScript throughout for type safety
- Centralized colors in `src/theme/colors.ts`
- Extracted strings in `src/strings/index.ts` for future localization
- Clear naming and consistent structure
- Comments only where business logic needs explanation

### Testability
- Business logic in hooks (easy to test)
- Presentational components (pure, testable)
- Redux selectors are isolated and testable
- Basic component tests written with Jest + React Testing Library
- Note: Tests need Jest config adjustments for React Native 0.81.5

### Execution
- Works on iOS and Android
- Performance optimizations targeting 60 FPS
- Handles network errors, timeouts, and API failures
- Loading states and skeleton screens
- Pull-to-refresh support

## Future Improvements

Ran out of time, so here's what I'd tackle next:

**Storage & State**
- Switch AsyncStorage to MMKV for better performance
- Move network status into Redux slice (it's currently in derived state, not SSOT)

**Code Quality**
- Use proper feature branches instead of pushing straight to main (e.g., `feat/jamendo-player`)
- Expand theme to include fonts and spacing scales
- Clean up relative paths and standardize imports

**Functionality**
- Add background audio modes so playback continues when app is in background
- More test coverage (hook tests, reducer tests, integration tests)

**Testing**
- Basic Jest component tests are written but need config tweaks for React Native 0.81.5 compatibility

## Demo

Videos and screenshots added here showing:
- Search functionality and infinite scroll
- Track detail screen and audio player

iOS :

https://github.com/user-attachments/assets/2702e36e-369c-4089-bbe8-857fd10b3adf

Android :

https://github.com/user-attachments/assets/b0ab7ea8-2d98-4e0f-a97d-4554e7293ce6


Screenshots :

iOS :

<img width="200" height="450" alt="Simulator Screenshot - iPhone 16 - 2025-11-05 at 01 38 22" src="https://github.com/user-attachments/assets/61cc2d74-c975-45c0-90e7-4f7000740c8b" />
<img width="200" height="450" alt="Simulator Screenshot - iPhone 16 - 2025-11-05 at 01 38 15" src="https://github.com/user-attachments/assets/26f0245d-e7af-47a7-bef5-7ca70e58f233" />
<img width="200" height="450" alt="Simulator Screenshot - iPhone 16 - 2025-11-05 at 01 38 04" src="https://github.com/user-attachments/assets/a143e743-b695-412a-a964-4aef12bd1467" />
<img width="200" height="450" alt="Simulator Screenshot - iPhone 16 - 2025-11-05 at 01 37 53" src="https://github.com/user-attachments/assets/d284ee65-2921-4519-9052-07ebce09d8e4" />

Android:

<img width="200" height="450" alt="Screenshot 2025-11-05 at 1 57 27 AM" src="https://github.com/user-attachments/assets/1f06bc55-08c2-473f-83eb-8b3c82332143" />
<img width="200" height="450" alt="Screenshot 2025-11-05 at 1 57 46 AM" src="https://github.com/user-attachments/assets/f70b2d9e-ea75-4cda-8d25-e9e74cdbce09" />
<img width="200" height="450" alt="Screenshot 2025-11-05 at 1 58 14 AM" src="https://github.com/user-attachments/assets/4b93c683-f611-4d65-a9bc-967f8c38bfd9" />


## Known Limitations

- **Testing**: Component tests are written with Jest but can't run yet due to React Native 0.81.5 compatibility issues. Tests follow best practices and should work once Jest config is adjusted.

- **Audio in Expo Go**: Audio playback needs a dev build (`npm run ios/android`). In Expo Go, you'll see a message explaining this.

- **Background Audio**: Currently only works in foreground. Background modes aren't enabled for this demo.

## License

This project is for assessment purposes. Jamendo API usage is subject to [Jamendo's Terms of Service](https://developer.jamendo.com/).
