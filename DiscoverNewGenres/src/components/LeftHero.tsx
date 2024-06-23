import styles from "../pages/styling/Hero.module.css";
import ParallaxText from "../utilities/ParallaxText";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextAnimation from "../utilities/TextAnimation";

const phrases = ["PEACE", "ANGER", "ENERGY", "JOY", "SADNESS", "FEAR", "LOVE"];

const LeftHero = ({
  handleLogin,
  guest,
  loading,
}: {
  handleLogin: () => void;
  guest: boolean;
  loading?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.left}>
      <div className={styles.top_bar}>
        <h3 className={styles.sectionTitle}>
          Song Safari {guest && "| Guest"}
        </h3>
        <h3 className={styles.sectionTitle}>
          Find
          <TextAnimation styles={styles} content={phrases} />
          in Music.
        </h3>
      </div>
      <h1 className={styles.title}>
        <ParallaxText baseVelocity={1}>Discover New Genres.</ParallaxText>
      </h1>
      <div>
        <h3 className={styles.sectionTitle}>
          Break free from the monotony of similar songs and explore the
          diversity of music. Using your Spotify Playlist, adjust the similarity
          of the new songs we recommend. This website was made possible thanks
          to&nbsp;
          <a href="https://everynoise.com" target="_blank">
            everynoise.
          </a>
        </h3>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={handleLogin}>
            Sign In
            {loading && (
              <AiOutlineLoading3Quarters className={styles.loading} />
            )}
          </button>

          {!guest && (
            <button onClick={() => navigate("/guest")}>Guest Login</button>
          )}

          <button className={styles.git}>
            <a href="https://github.com/rkdemy" target="_blank">
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  id="SVGRepo_tracerCarrier"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>github</title>
                  <rect fill="none" height="24" width="24"></rect>
                  <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"></path>
                </g>
              </svg>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftHero;
