import { MusicPlayer } from "../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MusicPlayer = {
  name: "",
  image: "",
  uri: "",
  artists: [],
  duration_ms: 0,
  index: 0,
  numberOfSongs: 0,
};

const UpdateMusicPlayer = createSlice({
  name: "UpdateMusicPlayer",
  initialState,
  reducers: {
    updateSelectedSong: (state, action: PayloadAction<MusicPlayer>) => {
      state.name = action.payload.name;
      state.image = action.payload.image;
      state.uri = action.payload.uri;
      state.artists = action.payload.artists;
      state.duration_ms = action.payload.duration_ms;
      state.index = action.payload.index;
      state.numberOfSongs = action.payload.numberOfSongs;
    },

    nextSong: (state) => {
      state.index = (state.index || 0) + 1;
    },

    previousSong: (state) => {
      state.index = (state.index || 0) - 1;
    },
  },
});

export const { updateSelectedSong, nextSong, previousSong } =
  UpdateMusicPlayer.actions;

export default UpdateMusicPlayer.reducer;
