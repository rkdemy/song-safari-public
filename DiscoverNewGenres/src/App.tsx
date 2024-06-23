import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import Guest from "./pages/Guest";
import Error from "./pages/Error";
import LoadingSpinner from "./components/LoadingSpinner";

const SelectPlaylist = lazy(() => import("./pages/SelectPlaylist"));
const SelectRecommendedPlaylist = lazy(
  () => import("./pages/SelectRecommendedPlaylist")
);

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      { index: true, element: <Hero /> },
      { path: "guest", element: <Guest /> },
      {
        path: "SelectPlaylist",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SelectPlaylist />
          </Suspense>
        ),
      },
      {
        path: "SelectRecommendedSongs",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SelectRecommendedPlaylist />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
