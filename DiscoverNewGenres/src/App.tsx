import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import SelectPlaylist from "./pages/SelectPlaylist";
import SelectRecommendedPlaylist from "./pages/SelectRecommendedPlaylist";
import Loading from "./pages/Loading";
import Guest from "./pages/Guest";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      { index: true, element: <Hero /> },
      { path: "guest", element: <Guest /> },
      { path: "SelectPlaylist", element: <SelectPlaylist /> },
      { path: "loading", element: <Loading /> },
      {
        path: "SelectRecommendedSongs",
        element: <SelectRecommendedPlaylist />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
