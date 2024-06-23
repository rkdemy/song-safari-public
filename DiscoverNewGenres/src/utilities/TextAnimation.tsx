import { useEffect } from "react";

const TextAnimation = ({
  styles,
  content,
}: {
  styles: CSSModuleClasses;
  content: string[];
}) => {
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
      wrapper.style.setProperty("--width", `${nextWord.offsetWidth}px`);
    }, 1800);

    return () => clearInterval(interval);
  }, []);
  return (
    <span className={styles.words}>
      {content.map((phrase, index) => (
        <span
          className={`${styles.word} ${
            index === 0 ? styles.current : index === 1 && styles.next
          }`}
          key={phrase}
        >
          {phrase}
        </span>
      ))}
    </span>
  );
};

export default TextAnimation;
