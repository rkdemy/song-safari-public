import React, { useEffect, useRef, useState } from "react";
import styles from "./styling/Songs.module.css";
import { useDispatch } from "react-redux";
import { updateSelectedSong } from "../redux/UpdateMusicPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TrackItem {
  track: {
    album: {
      images: {
        url: string;
      }[];
    };
    name: string;
    artists: {
      name: string;
    }[];
    duration_ms: number;
    uri: string;
  };
}

interface Song {
  tracks: {
    items: TrackItem[];
  };
}

interface SongsProps {
  data: Song | undefined; // Update the type of data to Song | undefined
  loading: boolean;
  error?: string;
}

const Songs: React.FC<SongsProps> = ({ data, loading, error }) => {
  const [selectedSong, setSelectedSong] = useState<number | null>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const selectedSongRef = useRef<Slider>(null);
  const { index } = useSelector((state: RootState) => state.musicPlayer);
  const { numberOfSongs } = useSelector(
    (state: RootState) => state.musicPlayer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.tracks && !loading) {
      setSelectedSong(0);
      if (selectedSongRef.current) {
        selectedSongRef.current.slickGoTo(0);
      }
    }
  }, [data, loading]);

  const handleClick = (index: number) => {
    if (selectedSong === index || !data || !data.tracks) {
      return;
    }

    setSelectedSong(index);

    if (selectedSongRef.current) {
      selectedSongRef.current.slickGoTo(index);
    }

    const firstSong = data.tracks.items[index].track;
    const initialMusicPlayer = {
      name: firstSong.name,
      image: firstSong.album.images[0].url,
      preview: firstSong.uri,
      artists: firstSong.artists,
      duration_ms: firstSong.duration_ms,
      index,
      numberOfSongs: data.tracks.items.length,
    };

    dispatch(updateSelectedSong(initialMusicPlayer));
  };

  useEffect(() => {
    if (index !== undefined && index !== selectedSong) {
      handleClick(index);
    }
  }, [index]);

  var settings = {
    dots: false,
    infinite: false,
    afterChange: (index: number) => setCurrentSlide(index),
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: false,
    row: 1,
    draggable: true,
    touchMove: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1049,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 858,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 660,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 512,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const onWheelSlider = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!selectedSongRef.current) return;
    if (e.deltaY > 0) {
      selectedSongRef.current.slickGoTo(currentSlide + 3);
    } else if (e.deltaY < 0) {
      selectedSongRef.current.slickGoTo(currentSlide - 3);
    }
  };

  return (
    <>
      {error ? (
        <div className={styles.song_container}>
          <h1>Your Songs</h1>
          <p>{error}</p>
        </div>
      ) : loading && (!data || !data.tracks) ? (
        <section className={styles.song_container}>
          <h1>Your Songs</h1>
        </section>
      ) : (
        <section className={styles.song_container}>
          <h1>Your Songs ({numberOfSongs})</h1>
          <section
            className={styles.song_container__scroll}
            onWheel={onWheelSlider}
          >
            <Slider {...settings} ref={selectedSongRef}>
              {data?.tracks.items.map((x: any, index: number) => (
                <div
                  className={`${styles.song_container__content} ${
                    index === selectedSong
                      ? styles.song_container__content_selected
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleClick(index)}
                >
                  <div className={styles.padding}>
                    <div className={styles.song_details}>
                      <div className={styles.image}>
                        {x.track?.album?.images?.[1]?.url && (
                          <img
                            src={x.track.album.images[1].url}
                            className={styles.song_image}
                            alt="Song cover"
                          />
                        )}
                        {x.track?.album?.images?.[2]?.url && (
                          <img
                            src={x.track.album.images[2].url}
                            className={styles.blur}
                            alt="Song cover"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3>{x.track?.name || "Unknown Title"}</h3>

                      <div className={styles.artists_names}>
                        {x.track?.artists?.map((y: any, index: number) => (
                          <h4 key={index}>{y.name}</h4>
                        )) || "Unknown Artist"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        </section>
      )}
    </>
  );
};

export default Songs;
