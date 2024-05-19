import styles from "./styling/SelectPlaylist.module.css";
import RecommendedPlaylist from "../components/RecommendedPlaylist";
import { useState } from "react";
import RecommendedSongs from "../components/RecommendedSongs";
import MusicPlayer from "../components/MusicPlayer";
import { useNavigate } from "react-router-dom";

const SelectRecommendedPlaylist = () => {
  const [index, setIndex] = useState<number>(0);
  const navigate = useNavigate();

  const handlePlaylistSelect = async (index: number) => {
    setIndex(index);
  };

  const handleBackButton = () => {
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

          <button className={styles.confirmButton} onClick={handleBackButton}>
            Go back
          </button>
        </div>
        <div className={styles.musicPlayer_content}>
          {/* Vinyl Player */}
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default SelectRecommendedPlaylist;
