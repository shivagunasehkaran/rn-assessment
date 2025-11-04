import { NativeModules } from "react-native";

type AudioProModule = typeof import("react-native-audio-pro");

// Define the AudioPro store state shape
export type AudioProStoreState = {
  state: string; // AudioProState enum value
  position: number;
  duration: number;
  playingTrack: {
    id: string;
    url: string;
    title: string;
    artist: string;
    album?: string;
    artwork?: string;
  } | null;
};

// Augment the module types if needed
declare module "react-native-audio-pro" {
  export function useAudioPro<T>(selector: (state: AudioProStoreState) => T): T;
}

let bindings: AudioProModule | null = null;
let loadError: Error | null = null;

try {
  if (NativeModules.AudioPro) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    bindings = require("react-native-audio-pro") as AudioProModule;
  }
} catch (error) {
  loadError = error as Error;
  bindings = null;
}

export const audioProBindings = bindings;
export const audioProLoadError = loadError;
export const isAudioProAvailable = Boolean(bindings);
