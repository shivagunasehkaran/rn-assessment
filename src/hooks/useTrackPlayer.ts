import { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, GestureResponderEvent } from "react-native";

import {
  audioProBindings,
  isAudioProAvailable,
  type AudioProStoreState,
} from "../lib/audioPro";

export type TrackPlayerConfig = {
  trackId: string;
  title: string;
  artist: string;
  album?: string | null;
  audioUrl: string;
  artworkUrl?: string | null;
  durationMs?: number;
};

type TrackPlayerUnavailable = {
  isAvailable: false;
  isPlaying: false;
  isBusy: false;
  position: number;
  durationMs: number;
  effectiveDurationMs: number;
  togglePlay: () => void;
  seekToRatio: (ratio: number) => void;
  seekBack: (ms?: number) => void;
  seekForward: (ms?: number) => void;
};

type TrackPlayerAvailable = {
  isAvailable: true;
  isPlaying: boolean;
  isBusy: boolean;
  artwork: string;
  effectiveDuration: number;
  effectiveDurationMs: number;
  durationMs: number;
  position: number;
  progressRatio: number;
  togglePlay: () => void;
  onSeekBarLayout: (width: number) => void;
  seekFromPress: (e: GestureResponderEvent) => void;
  seekToRatio: (ratio: number) => void;
  seekBack: (ms?: number) => void;
  seekForward: (ms?: number) => void;
};

type TrackPlayerResult = TrackPlayerUnavailable | TrackPlayerAvailable;

const FALLBACK_ART_URI = Image.resolveAssetSource(
  require("../../assets/icon.png")
).uri;

export const useTrackPlayer = (
  config: TrackPlayerConfig
): TrackPlayerResult => {
  const { trackId, title, artist, album, audioUrl, artworkUrl, durationMs } =
    config;

  if (!isAudioProAvailable || !audioProBindings) {
    return {
      isAvailable: false,
      isPlaying: false,
      isBusy: false,
      position: 0,
      durationMs: 0,
      effectiveDurationMs: durationMs ?? 0,
      togglePlay: () => undefined,
      seekToRatio: () => undefined,
      seekBack: () => undefined,
      seekForward: () => undefined,
    };
  }

  const { AudioPro, AudioProContentType, AudioProState, useAudioPro } =
    audioProBindings;

  const playerState = useAudioPro((s: AudioProStoreState) => s.playerState);
  const position = useAudioPro((s: AudioProStoreState) => s.position);
  const duration = useAudioPro((s: AudioProStoreState) => s.duration);
  const playingTrack = useAudioPro((s: AudioProStoreState) => s.trackPlaying);

  const isCurrentTrack = playingTrack?.id === trackId;
  const isPlaying = isCurrentTrack && playerState === AudioProState.PLAYING;
  const isBusy = isCurrentTrack && playerState === AudioProState.LOADING;

  const effectiveDuration = useMemo(() => {
    if (isCurrentTrack && duration > 0) return duration;
    return durationMs && durationMs > 0 ? durationMs : 0;
  }, [duration, isCurrentTrack, durationMs]);

  const artwork = artworkUrl ?? FALLBACK_ART_URI;

  const progressWidthRef = useRef(0);

  useEffect(() => {
    AudioPro.configure({
      contentType: AudioProContentType.MUSIC,
      showNextPrevControls: false,
      showSkipControls: true,
      skipIntervalMs: 15000,
    });
  }, [AudioPro, AudioProContentType]);

  useEffect(() => {
    return () => {
      const current = AudioPro.getPlayingTrack?.();
      if (current?.id === trackId) {
        AudioPro.stop();
        AudioPro.clear();
      }
    };
  }, [AudioPro, trackId]);

  const trackPayload = useMemo(
    () => ({
      id: trackId,
      url: audioUrl,
      title,
      artist,
      album: album ?? undefined,
      artwork,
    }),
    [album, artist, audioUrl, artwork, title, trackId]
  );

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;

    if (!isCurrentTrack || playerState === AudioProState.IDLE) {
      AudioPro.play(trackPayload, { autoPlay: true });
      return;
    }

    if (playerState === AudioProState.PLAYING) {
      AudioPro.pause();
      return;
    }

    if (
      playerState === AudioProState.PAUSED ||
      playerState === AudioProState.STOPPED
    ) {
      AudioPro.resume();
      return;
    }

    AudioPro.play(trackPayload, { autoPlay: true });
  }, [
    AudioPro,
    AudioProState,
    audioUrl,
    isCurrentTrack,
    playerState,
    trackPayload,
  ]);

  const onSeekBarLayout = useCallback((width: number) => {
    progressWidthRef.current = width;
  }, []);

  const seekFromPress = useCallback(
    (e: GestureResponderEvent) => {
      const w = progressWidthRef.current;
      if (!w || !effectiveDuration) return;

      const ratio = Math.min(Math.max(e.nativeEvent.locationX / w, 0), 1);

      if (!isCurrentTrack) {
        AudioPro.play(trackPayload, { autoPlay: false });
      }

      AudioPro.seekTo(Math.round(effectiveDuration * ratio));
    },
    [AudioPro, effectiveDuration, isCurrentTrack, trackPayload]
  );

  const seekBack = useCallback(
    (ms?: number) => {
      if (!isCurrentTrack) {
        AudioPro.play(trackPayload, { autoPlay: true });
        return;
      }
      AudioPro.seekBack(ms ?? 15000);
    },
    [AudioPro, isCurrentTrack, trackPayload]
  );

  const seekForward = useCallback(
    (ms?: number) => {
      if (!isCurrentTrack) {
        AudioPro.play(trackPayload, { autoPlay: true });
        return;
      }
      AudioPro.seekForward(ms ?? 15000);
    },
    [AudioPro, isCurrentTrack, trackPayload]
  );

  const progressRatio = useMemo(() => {
    if (!effectiveDuration) return 0;
    const raw = position / effectiveDuration;
    if (!Number.isFinite(raw)) return 0;
    return Math.min(Math.max(raw, 0), 1);
  }, [position, effectiveDuration]);

  const seekToRatio = useCallback(
    (ratio: number) => {
      if (!effectiveDuration) return;
      const clamped = Math.min(Math.max(ratio, 0), 1);
      if (!isCurrentTrack) {
        AudioPro.play(trackPayload, { autoPlay: false });
      }
      AudioPro.seekTo(Math.round(effectiveDuration * clamped));
    },
    [AudioPro, effectiveDuration, isCurrentTrack, trackPayload]
  );

  return {
    isAvailable: true,
    isPlaying,
    isBusy,
    artwork,
    effectiveDuration,
    effectiveDurationMs: effectiveDuration,
    durationMs: effectiveDuration,
    position,
    progressRatio,
    togglePlay,
    onSeekBarLayout,
    seekFromPress,
    seekToRatio,
    seekBack,
    seekForward,
  };
};

export default useTrackPlayer;
