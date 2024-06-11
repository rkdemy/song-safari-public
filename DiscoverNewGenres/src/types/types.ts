export interface MusicPlayer {
  name?: string;
  image?: string;
  uri?: string;
  artists?: Array<any>;
  duration_ms?: number;
  index?: number;
  numberOfSongs?: number;
}

export interface PlaylistData {
  href: string;
  items: Array<{
    name: string;
    href: string;
    tracks: {
      total: number;
    };
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  }>;
  limit: number;
  next: null | string;
  offset: number;
  previous: null | string;
  total: number;
}

export interface Track {
  track: {
    name: string;
    album: {
      images: { url: string }[];
    };
    uri: string;
    artists: { name: string }[];
    duration_ms: number;
    type: string;
  };
}

export interface Song {
  tracks: {
    items: Track[];
  };
}

export interface PlaylistItem {
  album: {
    artists: Array<{
      name: string;
    }>;
    available_markets: string[];
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string | null;
  };
}

export interface Playlist {
  InitialGenre: string;
  NearestGenre: string;
  href: string;
  items: PlaylistItem[];
  limit: number;
  next: string | null;
  total: number;
}
