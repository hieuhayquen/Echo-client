import { createSlice } from "@reduxjs/toolkit";

export const audioPlayer = createSlice({
	name: "audioPlayer",
	initialState: {
		currentSong: null,
		currentPlaylist: [],
		isRepeat: false,
	},
	reducers: {
		setCurrentSong: (state, action) => {
			state.currentSong = action.payload;
		},
		setCurrentPlaylist: (state, action) => {
			state.currentPlaylist = action.payload;
		},
		setIsRepeatTrue: (state) => {
			state.isRepeat = true;
		},
		setIsRepeatFalse: (state) => {
			state.isRepeat = false;
		},
	},
});

export const { 
	setCurrentSong,
	setCurrentPlaylist,
	setIsRepeatFalse,
	setIsRepeatTrue,
} = audioPlayer.actions;

export default audioPlayer.reducer;
