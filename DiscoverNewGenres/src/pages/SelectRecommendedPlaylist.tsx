import styles from "./styling/SelectPlaylist.module.css";
import RecommendedPlaylist from "../components/RecommendedPlaylist";
import { Suspense, lazy, useState } from "react";
import RecommendedSongs from "../components/RecommendedSongs";
import { useNavigate } from "react-router-dom";

const LazyMusicPlayer = lazy(() => import("../components/MusicPlayer"));

const SelectRecommendedPlaylist = () => {
  const [index, setIndex] = useState<number>(0);
  const navigate = useNavigate();

  const handlePlaylistSelect = (index: number): void => {
    setIndex(index);
  };

  const handleBackButton = (): void => {
    navigate("/SelectPlaylist");
  };

  return (
    <div className={styles.selectPlaylist}>
      <div className={styles.selectedPlaylist_container}>
        <div className={styles.playlist_content}>
          {/* Playlist */}
          <RecommendedPlaylist handlePlaylistSelect={handlePlaylistSelect} />

          {/* Song */}
          <RecommendedSongs idx={index} />

          <button
            className={styles.confirmButton}
            onClick={handleBackButton}
            style={{ marginTop: "1.5rem" }}
          >
            Go Back
          </button>
        </div>
        <div className={styles.musicPlayer_content}>
          {/* Vinyl Player */}
          <Suspense fallback={<></>}>
            <LazyMusicPlayer />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SelectRecommendedPlaylist;
