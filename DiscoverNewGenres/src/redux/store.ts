import { configureStore } from "@reduxjs/toolkit";
import UpdateMusicPlayer from "./UpdateMusicPlayer";
import AnalyzeSongs from "./AnalyzeSongs";

export const store = configureStore({
  reducer: {
    musicPlayer: UpdateMusicPlayer,
    newPlaylists: AnalyzeSongs,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
