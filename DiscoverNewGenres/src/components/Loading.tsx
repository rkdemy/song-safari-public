import TextAnimation from "../utilities/TextAnimation";
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
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <span>
          <TextAnimation styles={styles} content={phrases} />
        </span>
      </div>
    </div>
  );
};

export default Loading;
