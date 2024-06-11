import {
  getUserAccount,
  sendAccessTokenToServer,
} from "../utilities/getUserProfile";
import styles from "./styling/Hero.module.css";
import { useState } from "react";
import axios from "axios";
import LeftHero from "../components/LeftHero";
import RightHero from "../components/RightHero";

const Hero = () => {
  const [isLoading, setLoading] = useState(false);

  const handleUserAccount = async (): Promise<void> => {
    try {
      await getUserAccount();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleLogin = async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokenExpiry");

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/refresh_token`
      );

      if (response.status === 200) {
        const accessToken = response.data;
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
      <LeftHero handleLogin={handleLogin} guest={true} loading={isLoading} />
      <RightHero guest={true} />
    </div>
  );
};

export default Hero;
