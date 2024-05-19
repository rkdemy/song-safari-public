const express = require("express");
const PORT = 5000;
require("dotenv").config();
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


// Get the firestore details from firestore dashboard
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get a Firestore reference
const db = admin.firestore();

const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
};

// Find genre from genre object
// I use firestore to store the genre and cluster objects.
// You can access the same objects from the provided genre and cluster json files.
app.post("/genre_cluster", async (req, res) => {
  const { genreAverages, accessToken, similarityThreshold } = req.body;
  const storedGenreCluster = {};

  try {
    for (const genreName of genreAverages) {
      const genreSnapshot = await db
        .collection("genre_object")
        .doc(genreName)
        .get();

      if (genreSnapshot.exists) {
        storedGenreCluster[genreName] = genreSnapshot.data();
      } else {
        console.log("Genre not found", genreName);
      }
    }
    console.log(storedGenreCluster);
    const finalTracks = await searchTracksByGenre(
      storedGenreCluster,
      accessToken,
      similarityThreshold
    );

    res.status(200).json(finalTracks);
  } catch (error) {
    console.error("Error fetching genre data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchTracksByGenre = async (genre, accessToken, similarityThreshold) => {
  let finalTracks = [];
  let clusterMap = {};

  // Simply done to reduce the amount of times firestore is requested
  const genreEntries = Object.entries(genre);
  genreEntries.sort(([, a], [, b]) => a.Cluster.localeCompare(b.Cluster));
  const sortedGenre = Object.fromEntries(genreEntries);

  try {
    for (let name in sortedGenre) {
      const tracks = await calculateClusterMap(
        name,
        genre[name],
        accessToken,
        similarityThreshold,
        clusterMap
      );
      finalTracks.push({ InitialGenre: name, ...tracks[0] });
    }
    return finalTracks;
  } catch (error) {
    console.error("Error searching for tracks:", error.response);
    throw error;
  }
};

const calculateClusterMap = async (
  nameOfGenre,
  genre,
  accessToken,
  similarityThreshold,
  clusterMap
) => {
  let storedNearestGenre = {};
  let finalTrack = [];

  try {
    const clusterKey = genre.Cluster;

    if (
      clusterMap[clusterKey] &&
      clusterMap[clusterKey][0].Cluster == genre.Cluster
    ) {
    } else {
      // Fetch data from Firestore
      const clusterRef = db.collection("cluster_objects").doc(genre.Cluster);
      const clusterSnapshot = await clusterRef.get();

      if (clusterSnapshot.exists) {
        const clusterData = clusterSnapshot.data();

        // Check if the 'genres' field exists
        if (clusterData.genres) {
          // Store the 'genres' array in clusterMap[nameOfGenre]
          clusterMap[clusterKey] = clusterData.genres;
        } else {
          console.log(`No genres data found for cluster '${genre.Cluster}'.`);
          return;
        }
      } else {
        console.log(`Cluster '${genre.Cluster}' does not exist.`);
        return;
      }
    }

    const initialCoordinates = clusterMap[clusterKey].find(
      (g) => g.Name === nameOfGenre // Use g.Name for initial comparison
    );

    if (!initialCoordinates) {
      return;
    }

    const initialTop = parseFloat(initialCoordinates.Top);
    const initialLeft = parseFloat(initialCoordinates.Left);

    let currentGenre = nameOfGenre;

    while (true) {
      // Check if clusterMap[currentGenre] is undefined
      if (!clusterMap[clusterKey]) {
        break;
      }

      const nearestGenres = clusterMap[clusterKey].map((g) => {
        const genreTop = parseFloat(g.Top);
        const genreLeft = parseFloat(g.Left);

        const distance = calculateDistance(
          initialTop,
          initialLeft,
          genreTop,
          genreLeft
        );

        return { genre: g.SearchName, distance };
      });

      // Sort the nearest genres based on distance
      nearestGenres.sort((a, b) => a.distance - b.distance);

      // Select the genre based on the similarity threshold
      const selectedGenre = nearestGenres[similarityThreshold - 1]; // Adjust index for 0-based array

      if (!selectedGenre) {
        break;
      }

      // Checks if the selected genre is the same as the previous loop's selected genre
      // This if statement is a remnant of previous code. Im pretty sure its redundant.
      if (storedNearestGenre[currentGenre] === selectedGenre.genre) {
        currentGenre = selectedGenre.genre;
      } else {
        storedNearestGenre[currentGenre] = selectedGenre.genre;

        const { href, items, limit, next, total } = await spotifyGenreRequest(
          selectedGenre.genre,
          accessToken
        );

        if (items.length > 0) {
          // Found tracks for the nearest genre, break the loop
          finalTrack.push({
            NearestGenre: selectedGenre.genre,
            href,
            items,
            limit,
            next,
            total,
          });
          break;
        } else {
          // No tracks found, continue to the next nearest genre
          if (storedNearestGenre[currentGenre] !== selectedGenre.genre) {
            currentGenre = selectedGenre.genre;
          }
        }
      }
    }
    return finalTrack;
  } catch (error) {
    throw error;
  }
};

const spotifyGenreRequest = async (genre, accessToken) => {
  try {
    const url = new URL("https://api.spotify.com/v1/search");

    let genreQuery;
    if (genre.includes("'")) {
      // If genre tag contains single quotes, enclose it with double quotes
      genreQuery = `genre:"${genre}"`;
    } else {
      // If genre tag doesn't contain single quotes, use it as is
      genreQuery = `genre:${genre}`;
    }

    const queryParams = new URLSearchParams({
      q: genreQuery,
      type: "track",
    });

    url.search = queryParams.toString();

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const tracks = await response.json();
    return {
      href: tracks.tracks.href,
      items: tracks.tracks.items,
      limit: tracks.tracks.limit,
      next: tracks.tracks.next,
      total: tracks.tracks.total,
    };
  } catch (error) {
    console.error("Error searching for tracks:", error.response);
    throw error;
  }
};

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
