import React from "react";
import styles from "./styling/Error.module.css";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className={styles.error}>
        <h1>404</h1>
        <h3>Sorry, the page cannot be found</h3>
        <button onClick={() => navigate("/guest")}>Guest Login</button>
      </section>
    </>
  );
};

export default Error;
