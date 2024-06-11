import { getUserAccount } from "../utilities/getUserProfile";
import styles from "./styling/Hero.module.css";
import LeftHero from "../components/LeftHero";
import RightHero from "../components/RightHero";

const Hero = () => {
  const handleUserAccount = async (): Promise<void> => {
    try {
      await getUserAccount();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogin = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokenExpiry");

    handleUserAccount();
  };

  return (
    <div className={styles.container}>
      <LeftHero handleLogin={handleLogin} guest={false} />
      <RightHero guest={false} />
    </div>
  );
};

export default Hero;
