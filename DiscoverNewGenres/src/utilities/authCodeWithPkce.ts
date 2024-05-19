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

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token, refresh_token } = await result.json();
  console.log("refresh token", refresh_token);
  return access_token;
}

export async function getUserPlaylist(accessToken: string, profile: any) {
  try {
    const result = await fetch(
      `https://api.spotify.com/v1/users/${profile.id}/playlists`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!result.ok) {
      throw new Error("Failed to fetch your playlists");
    }

    const playlistData = await result.json();

    // Call getPlaylistSongs
    const playlistSongs = await getPlaylistSongs(
      accessToken,
      playlistData.items[0].href
    );

    return { playlistData, playlistSongs };
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    return error;
  }
}

export const getPlaylistSongs = async (
  accessToken: string,
  playlistId: string
) => {
  const result = await fetch(playlistId, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (result.ok) {
    const data = await result.json();
    return data;
  } else {
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
  const genresResponse = await fetch(
    `https://api.spotify.com/v1/artists?ids=${artistIds}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!genresResponse.ok) {
    throw new Error("Failed to fetch genres for artist");
  }

  const genresData = await genresResponse.json();
  const genres = genresData.artists.flatMap((artist: any) => artist.genres);
  return genres;
};

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
