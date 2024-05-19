import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import SelectPlaylist from "./pages/SelectPlaylist";
import SelectRecommendedPlaylist from "./pages/SelectRecommendedPlaylist";
import Loading from "./pages/Loading";
import Guest from "./pages/Guest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/SelectPlaylist" element={<SelectPlaylist />} />
        <Route path="/loading" element={<Loading />} />
        <Route
          path="/SelectRecommendedSongs"
          element={<SelectRecommendedPlaylist />}
        />
      </Routes>
    </Router>
  );
}

export default App;
