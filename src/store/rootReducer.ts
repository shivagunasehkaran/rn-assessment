import { combineReducers } from "@reduxjs/toolkit";

import tracksReducer from "../features/tracks/slice";

const rootReducer = combineReducers({
  tracks: tracksReducer,
});

export type RootReducer = typeof rootReducer;

export default rootReducer;

