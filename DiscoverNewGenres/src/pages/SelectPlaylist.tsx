import { Suspense, lazy, useEffect, useState } from "react";
import styles from "./styling/SelectPlaylist.module.css";
import Songs from "../components/Songs";
import Playlist from "../components/Playlist";
import { getUserAccount, populateUI } from "../utilities/getUserProfile";
import { updateSelectedSong } from "../redux/UpdateMusicPlayer";
import { useDispatch } from "react-redux";
import {
  getPlaylistSongs,
  getSongFeatures,
} from "../utilities/authCodeWithPkce";
import { resetPlaylistData, setNewPlaylistData } from "../redux/AnalyzeSongs";
import { useNavigate } from "react-router-dom";
import { PlaylistData, Song } from "../types/types";
import LoadingSpinner from "../components/LoadingSpinner";

const LoadingPage = lazy(() => import("../components/Loading"));
const LazyMusicPlayer = lazy(() => import("../components/MusicPlayer"));

const SelectPlaylist = () => {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isPlaylistSongs, setPlaylistSongs] = useState<Song | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isServerLoading, setServerLoading] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial User Data fetch
  useEffect(() => {
    const handleUserAccount = async (): Promise<void> => {
      dispatch(resetPlaylistData());

      setLoading(true);
      setError(null);
      try {
        const { playlistData, playlistSongs } = await getUserAccount();

        if (!playlistData || !playlistSongs) {
          setError("Playlist data or songs not available");
          throw new Error("Playlist data or songs not available");
        }

        const filteredSongs = playlistSongs.tracks.items.filter(
          (item) => item.track && item.track.type === "track"
        );

        setPlaylistData(playlistData);
        setPlaylistSongs({
          ...playlistSongs,
          tracks: { items: filteredSongs },
        });

        if (filteredSongs.length > 0) {
          const firstSong = filteredSongs[0].track;
          const initialMusicPlayer = {
            name: firstSong.name,
            image: firstSong.album.images[0].url,
            uri: firstSong.uri,
            artists: firstSong.artists,
            duration_ms: firstSong.duration_ms,
            numberOfSongs: filteredSongs.length,
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
  const handlePlaylistSelect = async (href: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const playlistSongs = await getPlaylistSongs(accessToken, href);

        const filteredSongs = playlistSongs.tracks.items.filter(
          (item) => item.track && item.track.type === "track"
        );

        setPlaylistSongs({
          ...playlistSongs,
          tracks: { items: filteredSongs },
        });

        if (filteredSongs.length > 0) {
          const firstSong = filteredSongs[0].track;
          const initialMusicPlayer = {
            name: firstSong.name,
            image: firstSong.album.images[0].url,
            uri: firstSong.uri,
            artists: firstSong.artists,
            duration_ms: firstSong.duration_ms,
            numberOfSongs: filteredSongs.length,
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
  const handleAnalysePlaylist = async (): Promise<void> => {
    setLoading(true);
    setServerLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (
        isPlaylistSongs &&
        isPlaylistSongs.tracks &&
        isPlaylistSongs.tracks.items.length > 0
      ) {
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
            setServerLoading(false);
            setLoading(false);
            navigate("/SelectRecommendedSongs");
          } else {
            // Handle error if newPlaylistData is null
            setError("Error contacting server.");
            setServerLoading(false);
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

  if (isServerLoading) {
    return (
      <Suspense fallback={<></>}>
        <LoadingPage />
      </Suspense>
    );
  }

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
            <h4>
              Determines similarity of the new genre:
              <span className={styles.thresholdValue}>
                {similarityThreshold == 1 ? (
                  <>{similarityThreshold} returns same genre</>
                ) : (
                  similarityThreshold
                )}
              </span>
            </h4>
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
            Confirm Playlist
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

export default SelectPlaylist;
