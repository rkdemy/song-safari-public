import axios from "axios";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  getUserPlaylist,
} from "../utilities/authCodeWithPkce";

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}
const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export const getUserAccount = async () => {
  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    try {
      let accessToken = localStorage.getItem("accessToken");
      let jwt = localStorage.getItem("jwt");
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (
        accessToken === null ||
        accessToken === undefined ||
        accessToken == "undefined" ||
        jwt === null ||
        jwt === undefined ||
        jwt == "undefined" ||
        !tokenExpiry ||
        Date.now() >= parseInt(tokenExpiry, 10)
      ) {
        accessToken = await getAccessToken(clientId, code);
        const expiryTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenExpiry", expiryTime.toString());

        jwt = await sendAccessTokenToServer(accessToken);
        localStorage.setItem("jwt", jwt);
      }

      const profile = await fetchProfile(accessToken);
      const { playlistData, playlistSongs } = await getUserPlaylist(
        accessToken,
        profile
      );

      return { playlistData, playlistSongs };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return error;
    }
  }
};

const fetchProfile = async (code: string): Promise<UserProfile> => {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${code}` },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await result.json();
};

export const sendAccessTokenToServer = async (accessToken: string) => {
  try {
    const response = await axios.post(import.meta.env.VITE_J_TOKEN, {
      accessToken,
    });
    return response.data.jwtToken;
  } catch (error) {
    console.error("Error sending access token to the server:", error);
  }
};

export function populateUI(
  songFeatures: any,
  accessToken: string,
  similarityThreshold: number
) {
  // Reduce genres for this song
  const reducedGenre: Array<any> = [];

  // Reduce genres for all songs
  songFeatures.forEach((genre: string) => {
    const foundIndex = reducedGenre.findIndex(
      (element) => element.name === genre
    );

    if (foundIndex >= 0) {
      reducedGenre[foundIndex].number++;
    } else {
      reducedGenre.push({ name: genre, number: 1 });
    }
  });

  // Find common genres
  let commonGenres = reducedGenre
    .filter((genre) => genre.number > 1)
    .sort((a, b) => b.number - a.number);

  if (commonGenres.length < 5) {
    commonGenres = reducedGenre
      .filter((genre) => genre.number >= 1)
      .sort((a, b) => b.number - a.number);
  }
  const minNumberOfGenres = Math.min(commonGenres.length, 9);

  const genreOfSongs: Array<string> = [];

  for (let i = 0; i < minNumberOfGenres; i++) {
    genreOfSongs.push(commonGenres[i].name);
  }

  const fetchGenreCluster = async (accessToken: string) => {
    const jwt = localStorage.getItem("jwt");

    try {
      const response = await axios.post(
        import.meta.env.VITE_CLUSTER_TOKEN,
        {
          genreAverages: genreOfSongs,
          accessToken: accessToken,
          similarityThreshold: similarityThreshold,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jwt,
          },
        }
      );

      const data = await response;
      let sortedList = sortSongByPopularity(data.data);
      return sortedList;
    } catch (error) {
      console.log(error);
    }
  };

  const finalTracks = fetchGenreCluster(accessToken);

  return finalTracks;
}

const sortSongByPopularity = (song: Array<any>) => {
  for (let i = 0; i < song.length; i++) {
    song[i]?.items.sort((a, b) => b.popularity - a.popularity);
  }
  return song;
};
