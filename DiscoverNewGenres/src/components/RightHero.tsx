import styles from "../pages/styling/Hero.module.css";
import Modal from "./Modal";
import { motion } from "framer-motion";
import login from "../assets/Hero/login.png";
import selectplaylist from "../assets/Hero/selectplaylist.png";
import recommendedsongs from "../assets/Hero/recommendedsongs.png";
import save from "../assets/Hero/save.png";

// WebP images
import loginWebp from "../assets/Hero/login.webp";
import selectplaylistWebp from "../assets/Hero/selectplaylist.webp";
import recommendedsongsWebp from "../assets/Hero/recommendedsongs.webp";
import saveWebp from "../assets/Hero/save.webp";
import VideoPlayer from "./VideoPlayer";

const tabs = [
  {
    id: "spotify",
    text: "Login to Spotify (Requires Spotify Premium).",
    image: login,
    imageWebP: loginWebp,
  },
  {
    id: "playlist",
    text: "Select playlist to analyze.",
    image: selectplaylist,
    imageWebP: selectplaylistWebp,
  },
  {
    id: "freshSongs",
    text: "Recieve new songs from unique genres.",
    image: recommendedsongs,
    imageWebP: recommendedsongsWebp,
  },
  {
    id: "favorites",
    text: "Listen & save to favorites.",
    image: save,
    imageWebP: saveWebp,
  },
];

const genres = [
  "Scream Rap",
  "Somali Pop",
  "German Trap",
  "Swiss Trap",
  "Russian Drill",
  "DFW Rap",
  "Dance Pop",
  "Alt Z",
  "Gen Z Singer-Songwriter",
  "Korean r&b",
  "New Wave Pop",
  "Indietronica",
  "Rock En Espanol",
  "Italian Pop",
  "Canadian Contemporary r&b",
];
const genres2 = [
  "New Romantic",
  "Turkish Pop",
  "Cloud Rap",
  "Spanish Pop",
  "German Pop",
  "Europop",
  "Sertanejo Pop",
  "Tropical House",
  "Australian Pop",
  "Japanese Teen Pop",
  "Shibuya Kei",
  "Bedroom r&b",
  "Modern Indie Pop",
  "Danish Pop",
  "Weirdcore",
];
const genres3 = [
  "Schlager",
  "Post-Punk Argentina",
  "Ska",
  "Classic Persian Pop",
  "Acoustic Chill",
  "Space Age Pop",
  "Czech Folk",
  "Honky Tonk",
  "neo-traditional bluegrass",
  "nueva ola chilena",
  "jamgrass",
  "poezja spiewana",
  "new orleans blues",
  "malian blues",
  "rumba congolaise",
];

const allGenres = [...genres, ...genres2, ...genres3];

const RightHero = ({ guest }) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <div className={styles.right}>
      <div className={styles.contact_container}>
        <Modal>
          <h3 className={styles.contact}>Contact</h3>
        </Modal>
      </div>
      <h1>Please note:</h1>

      {!guest ? (
        <p>
          My Spotify API is still on developer mode. This login method will not
          work. If you'd like to be added to my allowlist, please contact me
          with your email and name used for your Spotify account. I will add
          them to my allowlist as soon as I see them.
        </p>
      ) : (
        <p>
          This is the guest version. You will still need to log in with your
          Spotify account or create a new one. Please note, that the playlists
          and songs you see will be sourced from my account.
        </p>
      )}

      <div className={styles.tab}>
        <h1>Discover New Genres</h1>
        <motion.div
          className={styles.genre_container}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allGenres.map((genre, index) => (
            <motion.h3
              key={genre}
              className={styles.genreItem}
              variants={itemVariants}
            >
              {genre}
            </motion.h3>
          ))}
          <motion.h3
            className={styles.genreItem}
            variants={itemVariants}
            style={{ marginTop: "1rem" }}
          >
            6000+ more...
          </motion.h3>
        </motion.div>
      </div>

      <div className={styles.tab}>
        <h1>Discover New Songs</h1>
        <div className={styles.song_container}>
          <div className={styles.song}>
            <iframe
              src="https://open.spotify.com/embed/track/0zCxGhk0vueWH3q5NLUd1k?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              title="Honey by Amaal Nuux"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <h3>New genre: "Somali Pop" was "dfw rap"</h3>
          </div>
          <div className={styles.song}>
            <iframe
              src="https://open.spotify.com/embed/track/4YRU9CgJz1H1INMHINMyYA?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              title="Juicy Drill by INSTASAMKA"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <h3>New genre: "Russian Drill" was "melodic rap"</h3>
          </div>
          <div className={styles.song}>
            <iframe
              src="https://open.spotify.com/embed/track/40mBNGyiyYZ2KDzDiuBNUa?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              title="Martina Hingis by Piment"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <h3>New genre: "Swiss Trap" was "West Coast Rap"</h3>
          </div>
          <div className={styles.song}>
            <iframe
              src="https://open.spotify.com/embed/track/1ty0B6JLpCThZVvxANq5WY?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              title="Trap by OG Keemo"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <h3>New genre: "German Trap" was "Pop Rap"</h3>
          </div>
        </div>
      </div>

      <div className={styles.tab}>
        <h1>Heres how it works</h1>
        <div className={styles.tab_container}>
          {tabs.map((tab) => (
            <div className={styles.tab_content} key={tab.id}>
              <picture>
                <source srcSet={tab.imageWebP} type="image/webp" />
                <source srcSet={tab.image} type="image/png" />
                <img
                  src={tab.image}
                  alt={tab.text}
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </picture>
              <h3>{tab.text}</h3>
            </div>
          ))}
        </div>
      </div>

      <div>
        <VideoPlayer
          width="100%"
          height="100%"
          id="kqtvsenf8ru6dxay1fxp"
          className={styles.video}
        />
      </div>

      <section className={styles.songsGrid}>
        <h1>Songs found through Song Safari</h1>
        <iframe
          src="https://open.spotify.com/embed/playlist/5DiYbX6COF3xw4maoyoN2w?utm_source=generator&theme=0"
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default RightHero;
