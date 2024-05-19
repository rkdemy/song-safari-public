import React, { useEffect, useState } from "react";
import styles from "./styling/MusicPlayer.module.css";
import type { MusicPlayer } from "../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { nextSong, previousSong } from "../redux/UpdateMusicPlayer";
import SpotifyPlayer from "react-spotify-web-playback";

const MusicPlayer: React.FC<MusicPlayer> = () => {
  const [maxSongs, setMaxSongs] = useState<number>(0);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth > 1200);
  const dispatch = useDispatch();
  const playerRef = React.useRef<SpotifyPlayer | null>(null);

  const { name, image, preview, index, numberOfSongs } = useSelector(
    (state: RootState) => state.musicPlayer
  );

  const handleNext = () => {
    if (index === maxSongs - 1) {
      return;
    }
    dispatch(nextSong());
  };

  const handlePrevious = () => {
    if (index === 0) {
      return;
    }
    dispatch(previousSong());
  };

  useEffect(() => {
    setMaxSongs(numberOfSongs ?? 0);
  }, [index, name]);

  useEffect(() => {
    const setupButtonListeners = () => {
      let nextButton = document.querySelector('[aria-label="Custom Next"]');
      let prevButton = document.querySelector('[aria-label="Custom Previous"]');

      nextButton?.removeEventListener("click", handleNext);
      nextButton?.addEventListener("click", handleNext);

      prevButton?.removeEventListener("click", handlePrevious);
      prevButton?.addEventListener("click", handlePrevious);
    };
    setupButtonListeners();

    return () => {
      const nextButton = document.querySelector('[aria-label="Custom Next"]');
      const prevButton = document.querySelector(
        '[aria-label="Custom Previous"]'
      );
      if (nextButton) {
        nextButton.removeEventListener("click", handleNext);
      }
      if (prevButton) {
        prevButton.removeEventListener("click", handlePrevious);
      }
    };
  }, [preview]);

  const customLocale = {
    next: "Custom Next",
    previous: "Custom Previous",
  };

  useEffect(() => {
    const callbackFunction = playerRef.current?.props.callback;
    if (callbackFunction && playerRef.current) {
      const intervalId = setInterval(() => {
        {/*@ts-ignore*/}
        callbackFunction({ position: playerRef.current?.state.position });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [preview]);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize the state based on the current window size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className={styles.musicPlayer_container}>
      {image && isResponsive && (
        <div className={styles.track_image_container}>
          <img src={image} alt="Song cover" className={styles.track_image} />
        </div>
      )}

      <img src={image} alt="Song cover" className={styles.blur} />
      {preview && (
        <div className={styles.player_wrapper}>
          <SpotifyPlayer
            token={localStorage.getItem("accessToken") ?? ""}
            uris={[preview]}
            ref={playerRef}
            initialVolume={0.4}
            play={true}
            layout={!isResponsive ? "responsive" : "compact"}
            hideCoverArt={isResponsive}
            name=""
            locale={customLocale}
            inlineVolume={false}
            showSaveIcon={true}
            callback={(state: any) => {
              if (state.position >= 99) {
                handleNext();
              }
            }}
            styles={{
              bgColor: "transparent",
              color: "#e0e0e0",
              loaderColor: "#e0e0e0",
              sliderColor: "#ffffff",
              sliderHandleColor: "#e0e0e0",
              trackArtistColor: "gray",
              trackNameColor: "#ffffff",
              sliderTrackColor: "gray",
            }}
          />
        </div>
      )}
    </section>
  );
};

export default MusicPlayer;
