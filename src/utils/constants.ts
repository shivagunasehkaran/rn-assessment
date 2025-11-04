import { Image } from "react-native";

export const FALLBACK_IMAGE = "https://placehold.co/64x64?text=♪";

export const FALLBACK_ARTWORK_URI = Image.resolveAssetSource(
  require("../../assets/icon.png")
).uri;
