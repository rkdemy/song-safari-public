import React, { useEffect, useState } from "react";
import styles from "./styling/Playlist.module.css";
import ParallaxText from "../utilities/ParallaxText";

interface PlaylistData {
  href: string;
  items: Array<{
    name: string;
    href: string;
    tracks: {
      total: number;
    };
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  }>;
  limit: number;
  next: null | string;
  offset: number;
  previous: null | string;
  total: number;
}

interface PlaylistProps {
  data: PlaylistData;
  loading: boolean;
  handlePlaylistSelect: (href: string) => void;
  error: string;
}

const Playlist: React.FC<PlaylistProps> = ({
  data,
  loading,
  handlePlaylistSelect,
  error,
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>();

  useEffect(() => {
    if (data && data.items && !loading && !selectedPlaylist) {
      setSelectedPlaylist(data.items[0].href);
    }
  }, [data, loading, selectedPlaylist]);

  const handleClick = (href: string) => {
    setSelectedPlaylist(href);
    handlePlaylistSelect(href);
  };

  return (
    <>
      {error ? (
        <div className={styles.song_container}>
          <h1>Your Playlists</h1>
          <p>{error}</p>
        </div>
      ) : loading && (!data || !data.items) ? (
        <section className={styles.song_container}>
          <h1>Your Playlists</h1>
        </section>
      ) : (
        <section className={styles.song_container}>
          <section className={styles.song_container__scroll}>
            {data.items.map((x, index) => (
              <div
                className={styles.song_container__content}
                key={index}
                onClick={() => handleClick(x.href)}
                style={{
                  backgroundColor: x.href == selectedPlaylist ? "white" : "",
                  color: x.href == selectedPlaylist ? "#15161c" : "#e0e0e0",
                }}
              >
                <div className={styles.song_details}>
                  {x.name.length < 18 ? (
                    x.name
                  ) : (
                    <ParallaxText baseVelocity={3}>{x.name}</ParallaxText>
                  )}
                </div>
              </div>
            ))}
          </section>
        </section>
      )}
    </>
  );
};

export default Playlist;
