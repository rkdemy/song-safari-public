import React, { useEffect, useRef, useState } from "react";
import styles from "./styling/Songs.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateSelectedSong } from "../redux/UpdateMusicPlayer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecommendedSongs = ({ idx }) => {
  const [selectedSong, setSelectedSong] = useState<number | null>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const selectedSongRef = useRef<Slider>(null);

  const { data } = useSelector((state: RootState) => state.newPlaylists);
  const { index } = useSelector((state: RootState) => state.musicPlayer);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedSong(0);
    handleClick(0);
    if (selectedSongRef.current) {
      selectedSongRef.current.slickGoTo(0);
    }
  }, [data, idx]);

  useEffect(() => {
    if (index !== undefined && index !== selectedSong) {
      handleClick(index);
    }
  }, [index]);

  if (!data[0] || !data[0][idx]) {
    return null;
  }

  const targetedObject = data[0][idx];

  const handleClick = (songIndex: number) => {
    if (!data[0] || !data[0][idx]) {
      return;
    }
    setSelectedSong(songIndex);

    if (selectedSongRef.current) {
      selectedSongRef.current.slickGoTo(songIndex);
    }

    const firstSong = data[0][idx].items[songIndex];
    const initialMusicPlayer = {
      name: firstSong.name,
      image:
        firstSong.album.images[0].url !== null
          ? firstSong.album.images[0].url
          : "",
      preview: firstSong.uri,
      duration_ms: firstSong.duration_ms,
      index: songIndex,
      numberOfSongs: data[0][idx].items.length,
    };

    dispatch(updateSelectedSong(initialMusicPlayer));
  };

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
    <section className={styles.song_container}>
      <h1>
        New Songs was <span>{targetedObject?.InitialGenre}</span>
      </h1>
      <section
        className={styles.song_container__scroll}
        onWheel={onWheelSlider}
      >
        <Slider {...settings} ref={selectedSongRef}>
          {targetedObject?.items.map((song: any, songIndex: number) => (
            <div
              className={`${styles.song_container__content} ${
                songIndex === selectedSong
                  ? styles.song_container__content_selected
                  : ""
              }`}
              key={songIndex}
              onClick={() => handleClick(songIndex)}
            >
              <div className={styles.padding}>
                <div className={styles.song_details}>
                  <div className={styles.image}>
                    <img
                      src={song.album.images[0].url}
                      className={styles.song_image}
                      alt="Song cover"
                    />
                    <img
                      src={song.album.images[0].url}
                      className={styles.blur}
                      alt="Song cover"
                    />
                  </div>
                </div>

                <div>
                  <h3>{song.name}</h3>

                  <div className={styles.artists_names}>
                    {song.artists.map((artist: any, artistIndex: number) => (
                      <h4 key={artistIndex}>{artist.name}</h4>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </section>
  );
};

export default RecommendedSongs;
