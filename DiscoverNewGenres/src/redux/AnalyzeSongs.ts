import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist } from "../types/types";

const initialState = {
  data: [],
};

const AnalyzeSongs = createSlice({
  name: "AnalyzeSongs",
  initialState,
  reducers: {
    setNewPlaylistData: (state, action: PayloadAction<Playlist[]>) => {
      state.data.push(action.payload);
    },
    resetPlaylistData: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { setNewPlaylistData, resetPlaylistData } = AnalyzeSongs.actions;

export default AnalyzeSongs.reducer;
