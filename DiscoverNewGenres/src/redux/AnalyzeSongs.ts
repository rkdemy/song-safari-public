import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface PlaylistItem {
  album: {
    artists: Array<{
      name: string;
    }>;
    available_markets: string[];
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string | null;
  };
}

interface Playlist {
  "Initial Genre": string;
  tracks: {
    href: string;
    items: PlaylistItem[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

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
