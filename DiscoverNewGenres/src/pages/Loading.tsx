import { useEffect, useState } from "react";
import styles from "./styling/Loading.module.css";

const phrases = [
  "Analyzing playlist...",
  "Finding genres...",
  "Finding common genres...",
  "Sending genres to server...",
  "Finding nearest genres...",
  "Finding songs...",
];

const Loading = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 1800);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        {phrases.map((phrase, index) => (
          <h1
            key={index}
            className={styles.text}
            style={{
              color: index === currentPhraseIndex ? "white" : "gray",
              transform: `translateY(${index - currentPhraseIndex}%)`,
            }}
          >
            {phrase}
          </h1>
        ))}
      </div>
    </div>
  );
};

export default Loading;
