import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View } from "react-native";

import { persistor, store } from "../src/store";
import { tracksThunks } from "../src/features/tracks";

const Loading = () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
    }}
  >
    <ActivityIndicator size="large" color="#111827" />
  </View>
);

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<Loading />}
        persistor={persistor}
        onBeforeLift={() => {
          store.dispatch(tracksThunks.hydrateTracksFromSnapshot());
        }}
      >
        <StatusBar style="dark" />
        <Slot />
      </PersistGate>
    </Provider>
  );
}

