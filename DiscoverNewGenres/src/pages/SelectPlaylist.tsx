import { useEffect, useState } from "react";
import styles from "./styling/SelectPlaylist.module.css";
import MusicPlayer from "../components/MusicPlayer";
import Songs from "../components/Songs";
import Playlist from "../components/Playlist";
import { getUserAccount, populateUI } from "../realUtility/getUserProfile";
import { updateSelectedSong } from "../redux/UpdateMusicPlayer";
import { useDispatch } from "react-redux";
import {
  getPlaylistSongs,
  getSongFeatures,
} from "../utilities/authCodeWithPkce";
import { resetPlaylistData, setNewPlaylistData } from "../redux/AnalyzeSongs";
import { useNavigate } from "react-router-dom";

const SelectPlaylist = () => {
  const [playlistData, setPlaylistData] = useState();
  const [isPlaylistSongs, setPlaylistSongs] = useState(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserAccount = async () => {
      dispatch(resetPlaylistData());

      setLoading(true);
      setError(null);
      try {
        const { playlistData, playlistSongs } = await getUserAccount();

        if (!playlistData || !playlistSongs) {
          setError("Playlist data or songs not available");
          throw new Error("Playlist data or songs not available");
        }
        setPlaylistData(playlistData);
        setPlaylistSongs(playlistSongs);
        if (playlistSongs.tracks.items.length > 0) {
          const firstSong = playlistSongs.tracks.items[0].track;
          const initialMusicPlayer = {
            name: firstSong.name,
            image: firstSong.album.images[0].url,
            preview: firstSong.uri,
            artists: firstSong.artists,
            duration_ms: firstSong.duration_ms,
            numberOfSongs: playlistSongs.tracks.items.length,
          };

          dispatch(updateSelectedSong(initialMusicPlayer));
        }

        setLoading(false);
      } catch (error) {
        setError(error.toString());
        setLoading(false);
      }
    };

    handleUserAccount();
  }, []);

  // If another playlist is clicked.
  const handlePlaylistSelect = async (href: string) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // Call getPlaylistSongs to fetch songs
        const playlistSongs = await getPlaylistSongs(accessToken, href);

        setPlaylistSongs(playlistSongs);

        if (playlistSongs.tracks.items.length > 0) {
          const firstSong = playlistSongs.tracks.items[0].track;
          const initialMusicPlayer = {
            name: firstSong.name,
            image: firstSong.album.images[0].url,
            preview: firstSong.uri,
            artists: firstSong.artists,
            duration_ms: firstSong.duration_ms,
            numberOfSongs: playlistSongs.tracks.items.length,
          };

          dispatch(updateSelectedSong(initialMusicPlayer));
        }
        setLoading(false);
      }
    } catch (error) {
      setError(error.toString());
      setLoading(false);
    }
  };

  // Confirm Playlist Analysis
  const handleAnalysePlaylist = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (
        isPlaylistSongs &&
        isPlaylistSongs.tracks &&
        isPlaylistSongs.tracks.items.length > 0
      ) {
        navigate("/loading");

        const songFeatures = await getSongFeatures(
          isPlaylistSongs?.tracks.items,
          accessToken
        );
        if (songFeatures) {
          const newPlaylistData = await populateUI(
            songFeatures,
            accessToken,
            similarityThreshold
          );
          if (newPlaylistData) {
            dispatch(setNewPlaylistData(newPlaylistData));
            setLoading(false);
            navigate("/SelectRecommendedSongs");
          } else {
            // Handle error if newPlaylistData is null
            setError("Error contacting server.");
            setLoading(false);
            navigate("/SelectPlaylist");
          }
        }
      }
    } catch (error) {
      setError(error.toString());
      setLoading(false);
      navigate("/SelectPlaylist");
    }
  };

  return (
    <div className={styles.selectPlaylist}>
      <div className={styles.selectedPlaylist_container}>
        <div className={styles.playlist_content}>
          {/* Playlist */}
          <Playlist
            data={playlistData}
            loading={isLoading}
            handlePlaylistSelect={handlePlaylistSelect}
            error={error}
          />

          {/* Song */}
          <Songs data={isPlaylistSongs} loading={isLoading} error={error} />

          <div className={styles.similarityThreshold}>
            <h3>
              Determines how similar the new genre will be:
              <span className={styles.thresholdValue}>
                {similarityThreshold == 1 ? (
                  <>{similarityThreshold} returns the same genre</>
                ) : (
                  similarityThreshold
                )}
              </span>
            </h3>
            <input
              type="range"
              id="similarityThreshold"
              name="similarityThreshold"
              min="1"
              max="30"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          {/* Confirm Playlist Analysis */}
          <button
            className={styles.confirmButton}
            onClick={() => handleAnalysePlaylist()}
          >
            Confirm Playlist to Analyse
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

export default SelectPlaylist;
