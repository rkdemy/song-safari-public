import React, { useEffect, useState } from "react";
import styles from "./styling/MusicPlayer.module.css";
import type { MusicPlayer } from "../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { nextSong, previousSong } from "../redux/UpdateMusicPlayer";
import SpotifyPlayer from "react-spotify-web-playback";

const MusicPlayer: React.FC<MusicPlayer> = () => {
  const [maxSongs, setMaxSongs] = useState(0);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth > 1200);
  const dispatch = useDispatch();
  const playerRef = React.useRef<SpotifyPlayer | null>(null);

  const { name, image, uri, index, numberOfSongs } = useSelector(
    (state: RootState) => state.musicPlayer
  );

  const customLocale = {
    next: "Custom Next",
    previous: "Custom Previous",
  };

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

  // Basically setting the max length of the current playlist.
  // There is room for improvement. Currently if i don't reset the maxSongs every new song. The maxSongs becomes 0.
  // Perhaps I misconfigured Redux.
  useEffect(() => {
    setMaxSongs(numberOfSongs ?? 0);
  }, [index, name]);

  // Listens for button press on the next/prev buttons
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
  }, [uri]);

  // Used in conjunction with the callback inside SpotifyPlaylist component.
  // Next song is selected when current song ends.
  useEffect(() => {
    const callbackFunction = playerRef.current?.props.callback;
    if (callbackFunction && playerRef.current) {
      const intervalId = setInterval(() => {
        /*@ts-ignore*/
        callbackFunction({ position: playerRef.current?.state.position });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [uri]);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      className={
        isResponsive
          ? styles.musicPlayer_container
          : styles.musicPlayer_container_phone
      }
    >
      {image && isResponsive && (
        <div className={styles.track_image_container}>
          <img src={image} alt="Song cover" className={styles.track_image} />
          <img src={image} alt="Song cover" className={styles.blur} />
        </div>
      )}

      {!isResponsive && (
        <img src={image} alt="Song cover" className={styles.blur} />
      )}

      {uri && (
        <div className={styles.player_wrapper}>
          <SpotifyPlayer
            token={localStorage.getItem("accessToken") ?? ""}
            uris={[uri]}
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
