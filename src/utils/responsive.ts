import { Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints
const BREAKPOINTS = {
  small: 375,
  medium: 768,
  large: 1024,
};

// Check if device is tablet
export const isTablet = (): boolean => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (
    (Platform.OS === "ios" && (SCREEN_WIDTH >= 768 || aspectRatio < 1.6)) ||
    (Platform.OS === "android" && SCREEN_WIDTH >= 600)
  );
};

// Responsive width percentage
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

// Responsive height percentage
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Scale font size based on screen width
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BREAKPOINTS.small;
  const newSize = size * scale;
  return Math.max(Math.round(newSize), size * 0.8); // Don't scale below 80%
};

// Scale size (for padding, margins, etc.)
export const scaleSize = (size: number): number => {
  if (isTablet()) {
    return size * 1.5; // 50% larger on tablets
  }
  return size;
};

// Get responsive padding
export const getResponsivePadding = (
  base: number,
  tablet?: number
): number => {
  return isTablet() ? tablet ?? base * 1.5 : base;
};

// Get responsive font size
export const getResponsiveFontSize = (
  base: number,
  tablet?: number
): number => {
  if (isTablet()) {
    return tablet ?? base * 1.2; // 20% larger on tablets
  }
  return base;
};

export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: isTablet(),
};

