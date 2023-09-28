import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import playlistSlice from "./playListSlice";
import audioPlayer from "./audioPlayer";
import userSlice from "./userSlice";

const reducers = combineReducers({
	auth: authReducer,
	playlists: playlistSlice,
	audioPlayer: audioPlayer,
	user: userSlice,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth", "audioPlayer"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
