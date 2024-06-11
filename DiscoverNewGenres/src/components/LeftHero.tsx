import React, { useEffect } from "react";
import styles from "../pages/styling/Hero.module.css";
import ParallaxText from "../utilities/ParallaxText";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

  useEffect(() => {
    const wrapper = document.querySelector(`.${styles.words}`);
    const words = wrapper.querySelectorAll(`.${styles.word}`);
    const currentWord = wrapper.querySelector(`.${styles.current}`);
    //@ts-ignore
    const wordsWidths = Array.from(words).map((word) => word.offsetWidth);
    const maxWordsWidth = Math.max(...wordsWidths);
    const CURRENT_CLASS = styles.current;
    const NEXT_CLASS = styles.next;
    //@ts-ignore
    wrapper.style.setProperty("--width", `${currentWord.offsetWidth}px`);
    //@ts-ignore
    wrapper.style.setProperty("--width-mobile", `${maxWordsWidth}px`);

    const interval = setInterval(() => {
      const currentWord = wrapper.querySelector(`.${styles.current}`);
      const nextWord = wrapper.querySelector(`.${styles.next}`);
      const nextNextWord = nextWord.nextElementSibling
        ? nextWord.nextElementSibling
        : wrapper.firstElementChild;
      currentWord.classList.remove(CURRENT_CLASS);
      nextWord.classList.remove(NEXT_CLASS);
      nextWord.classList.add(CURRENT_CLASS);
      nextNextWord.classList.add(NEXT_CLASS);
      //@ts-ignore
      wrapper.style.setProperty("--color", nextWord.dataset.color);
      //@ts-ignore
      wrapper.style.setProperty("--color-bg", nextWord.dataset.bgColor);
      //@ts-ignore
      wrapper.style.setProperty("--width", `${nextWord.offsetWidth}px`);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.left}>
      <div className={styles.top_bar}>
        <h3 className={styles.sectionTitle}>
          Song Safari {guest && "| Guest"}
        </h3>
        <h3 className={styles.sectionTitle}>
          Find
          <span className={styles.words}>
            <span
              className={`${styles.word} ${styles.current}`}
              data-bg-color="#ffc703"
              data-color="#000"
            >
              PEACE
            </span>
            <span
              className={`${styles.word} ${styles.next}`}
              data-bg-color="#004e98"
              data-color="#fff"
            >
              ANGER
            </span>
            <span
              className={styles.word}
              data-bg-color="#104911"
              data-color="#fff"
            >
              ENERGY
            </span>
            <span
              className={styles.word}
              data-bg-color="#b8c0ff"
              data-color="#000"
            >
              JOY
            </span>
            <span
              className={styles.word}
              data-bg-color="#e71d36"
              data-color="#fff"
            >
              SADNESS
            </span>
            <span
              className={styles.word}
              data-bg-color="#e2c044"
              data-color="#000"
            >
              FEAR
            </span>
            <span
              className={styles.word}
              data-bg-color="#065a82"
              data-color="#fff"
            >
              LOVE
            </span>
          </span>
          in Music.
        </h3>
      </div>
      <h1 className={styles.title}>
        <ParallaxText baseVelocity={1}>Discover New Genres.</ParallaxText>
      </h1>
      <div>
        <p>Portfolio Website, Github</p>
        <h3 className={styles.sectionTitle}>
          A website to help discover new music genres based on your spotify
          playlist. By analyzing the genres associated with the artists in your
          playlist, it identifies similar yet distinct genres and recommends new
          songs to broaden your musical tastes. This website was made possible
          due to&nbsp;
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
