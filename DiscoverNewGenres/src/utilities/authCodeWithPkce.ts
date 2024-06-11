import axios from "axios";
import { PlaylistData, Song } from "../types/types";

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append(
    "redirect_uri",
    `${import.meta.env.VITE_REDIRECT_URI}/SelectPlaylist`
  );
  params.append(
    "scope",
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming user-library-read"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId: string, code: string) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append(
    "redirect_uri",
    `${import.meta.env.VITE_REDIRECT_URI}/SelectPlaylist`
  );
  params.append("code_verifier", verifier!);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Error while getting access token:", error);
    throw error;
  }
}

export async function getUserPlaylist(
  accessToken: string,
  profile: any
): Promise<{
  playlistData: PlaylistData;
  playlistSongs: Song;
}> {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/users/${profile.id}/playlists`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const playlistData = response.data;

    // Call getPlaylistSongs
    const playlistSongs = await getPlaylistSongs(
      accessToken,
      playlistData.items[0].href
    );

    return { playlistData, playlistSongs };
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw error;
  }
}

export const getPlaylistSongs = async (
  accessToken: string,
  playlistId: string
) => {
  try {
    const response = await axios.get(playlistId, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch your playlist songs:", error);
    throw new Error("Failed to fetch your playlist songs");
  }
};

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const getSongFeatures = async (tracks: any, accessToken: string) => {
  const featureArray = [];
  const singleArtistIds = [];
  const multiArtistGenres = [];

  for (let i = 0; i < tracks.length; i++) {
    const artists = tracks[i].track.artists;

    if (artists.length === 1) {
      singleArtistIds.push(artists[0].id);
    } else if (artists.length > 1) {
      const artistIds = artists.map((artist: any) => artist.id).join(",");
      const genres = await fetchArtistGenres(artistIds, accessToken);
      multiArtistGenres.push([...new Set(genres)]);
    }
  }

  // Fetch genres for songs with a single artist
  if (singleArtistIds.length > 0) {
    const singleArtistGenres = await fetchArtistGenres(
      singleArtistIds.join(","),
      accessToken
    );
    featureArray.push(...singleArtistGenres);
  }

  // Merge genres for multi-artist songs into the featureArray
  if (multiArtistGenres.length > 0) {
    featureArray.push(...multiArtistGenres.flat());
  }

  return featureArray;
};

const fetchArtistGenres = async (artistIds: string, accessToken: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists?ids=${artistIds}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const genresData = response.data;
    const genres = genresData.artists.flatMap((artist: any) => artist.genres);
    return genres;
  } catch (error) {
    console.error("Failed to fetch genres for artist:", error);
    throw new Error("Failed to fetch genres for artist");
  }
};

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
