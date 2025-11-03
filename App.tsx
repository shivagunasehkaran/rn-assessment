import { ExpoRoot } from "expo-router";
import { ctx } from "expo-router/_ctx";

export default function App() {
  return <ExpoRoot context={ctx} />;
}
