import {
  getUserAccount,
  sendAccessTokenToServer,
} from "../realUtility/getUserProfile";
import styles from "./styling/Hero.module.css";
import login from "../assets/Hero/login.png";
import selectplaylist from "../assets/Hero/selectplaylist.png";
import recommendedsongs from "../assets/Hero/recommendedsongs.png";
import save from "../assets/Hero/save.png";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const tabs = [
  {
    id: "spotify",
    text: "Login/Create Spotify Account",
    image: login,
  },
  {
    id: "playlist",
    text: "Select playlist to analyze.",
    image: selectplaylist,
  },
  {
    id: "freshSongs",
    text: "Recieve songs from new genres.",
    image: recommendedsongs,
  },
  {
    id: "favorites",
    text: "Listen & save to favorites.",
    image: save,
  },
];

const Hero = () => {
  const [isLoading, setLoading] = useState(false);

  const handleUserAccount = async () => {
    try {
      const userData = await getUserAccount();
      console.log("User Data:", userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokenExpiry");

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/refresh_token`
      );
      if (response.ok) {
        const accessToken = await response.json();
        if (accessToken) {
          const expiryTime = Date.now() + 60 * 60 * 1000;
          localStorage.setItem("tokenExpiry", expiryTime.toString());
          localStorage.setItem("accessToken", accessToken.access_token);

          let jwt = await sendAccessTokenToServer(accessToken);
          localStorage.setItem("jwt", jwt);
        }

        handleUserAccount();
        setLoading(false);
      } else {
        console.error("Failed to retrieve access token.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.hero_content}>
          <h1 className={styles.title}>Song Safari - Guest</h1>
          <h2>Discover New Genres</h2>
          <h3 className={styles.sectionTitle}>
            A website to help discover new music genres based on your spotify
            playlist. By analyzing the genres associated with the artists in
            your playlist, it identifies similar yet distinct genres and
            recommends new songs to broaden your musical tastes.
            <br />
            <br />
            <span>Please note</span> that while this guest version requires you
            to have a Spotify account, the playlists and songs you'll see will
            be sourced from my own account due to the nature of the Spotify API
            and access tokens.
            <br />
            <br />
            This website was made possible due to&nbsp;
            <a href="https://everynoise.com" target="_blank">
              everynoise.
            </a>
          </h3>
          <button onClick={handleLogin}>
            Login to Spotify
            {isLoading && (
              <AiOutlineLoading3Quarters className={styles.loading} />
            )}
          </button>
          <div className={styles.tab}>
            <h1>Heres how it works</h1>

            {tabs.map((tab) => (
              <div className={styles.tab_content} key={tab.id}>
                <h3>{tab.text}</h3>
                <img src={tab.image} alt="" />
              </div>
            ))}
          </div>

          <section className={styles.songsGrid}>
            <h1>Some songs I was recommended through this website.</h1>
            <div className={styles.song}>
              <h3>New genre: "Somali Pop" was "dfw rap"</h3>
              <iframe
                src="https://open.spotify.com/embed/track/0zCxGhk0vueWH3q5NLUd1k?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className={styles.song}>
              <h3>New genre: "Russian Drill" was "melodic rap"</h3>
              <iframe
                src="https://open.spotify.com/embed/track/4YRU9CgJz1H1INMHINMyYA?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className={styles.song}>
              <h3>New genre: "Swiss Trap" was "West Coast Rap"</h3>
              <iframe
                src="https://open.spotify.com/embed/track/40mBNGyiyYZ2KDzDiuBNUa?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className={styles.song}>
              <h3>New genre: "German Trap" was "Pop Rap"</h3>
              <iframe
                src="https://open.spotify.com/embed/track/1ty0B6JLpCThZVvxANq5WY?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className={styles.song}>
              <h3>New genre: "Scream Rap" was "Pop"</h3>
              <iframe
                src="https://open.spotify.com/embed/track/2zOZONsFmrR8bgbkrxOwXw?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Hero;
