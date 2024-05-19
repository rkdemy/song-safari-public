import styles from "./styling/Playlist.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import ParallaxText from "../utilities/ParallaxText";

interface RecommendedPlaylistProps {
  handlePlaylistSelect: (index: number) => void;
}

const RecommendedPlaylist: React.FC<RecommendedPlaylistProps> = ({
  handlePlaylistSelect,
}) => {
  const { data } = useSelector((state: RootState) => state.newPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>();

  const handleNewPlaylist = (index: number) => {
    handlePlaylistSelect(index);
    setSelectedPlaylist(index);
  };

  useEffect(() => {
    setSelectedPlaylist(0);
    handlePlaylistSelect(0);
  }, [data]);

  return (
    <>
      <section className={styles.song_container}>
        <section className={styles.song_container__scroll}>
          {data[0]?.map((x: any, index: number) => (
            <div
              className={styles.song_container__content}
              key={index}
              onClick={() => handleNewPlaylist(index)}
              style={{
                backgroundColor: index == selectedPlaylist ? "white" : "",
                color: index == selectedPlaylist ? "#15161c" : "#e0e0e0",
              }}
            >
              <div className={styles.song_details}>
                {x.NearestGenre.length < 18 ? (
                  x.NearestGenre
                ) : (
                  <ParallaxText baseVelocity={3}>{x.NearestGenre}</ParallaxText>
                )}
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default RecommendedPlaylist;
