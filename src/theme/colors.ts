export const colors = {
  // Gray scale
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  // Blue scale
  blue50: "#e0f2fe",
  blue500: "#2563eb",
  blue600: "#0369a1",
  blue700: "#60a5fa",

  // Yellow/Amber scale
  yellow50: "#fef3c7",
  yellow600: "#b45309",
  yellow700: "#92400e",

  // Red scale
  red700: "#b91c1c",

  // Pure colors
  white: "#fff",
  black: "#000",

  // Semantic colors
  background: "#f9fafb",
  surface: "#fff",
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    tertiary: "#9ca3af",
    inverse: "#fff",
  },
  border: "#d1d5db",
  error: "#b91c1c",
  warning: "#92400e",
  primary: "#2563eb",
  player: {
    background: "#111827",
    surface: "#1f2937",
    progress: "#60a5fa",
    text: "#f9fafb",
    textSecondary: "#d1d5db",
    textTertiary: "#9ca3af",
  },
} as const;

export type Colors = typeof colors;

export default colors;

