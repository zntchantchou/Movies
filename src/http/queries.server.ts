import { queryOptions } from "@tanstack/react-query";
import NotFoundError from "../server/errors/NotFoundError.ts";

const MOVIE_GENRES = {
  ANIMATION: 16,
  ACTION: 28,
  DOCUMENTARY: 99,
  COMEDY: 35,
  HISTORY: 36,
  ERROR: 1000,
} as const;

const API_URL = "https://api.themoviedb.org/3";

async function getHomePageMovies() {
  const moviePromises = [
    getMoviesByGenre(MOVIE_GENRES.DOCUMENTARY),
    getMoviesByGenre(MOVIE_GENRES.COMEDY),
    getMoviesByGenre(MOVIE_GENRES.HISTORY),
    getPopularMovies(),
    getNowPlayingMovies(),
  ];
  const [documentaries, comedies, history, popularMovies, nowPlayingMovies] =
    await Promise.all(moviePromises);
  return {
    documentaries,
    popular: popularMovies,
    comedies,
    history,
    nowPlaying: nowPlayingMovies,
  };
}

async function getMovies(url: string) {
  try {
    const headers = new Headers();
    if (!process || !process?.env) return null;
    headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    return parsedMovies.results;
  } catch (e) {
    // this must not be imported in the front-end code because logger in already instanciated (singleton) and relies on join from node's "path"
    if (typeof window === "undefined") {
      const Logger = await (await import("../utils/Logger.ts")).default;
      Logger.error(e as Error);
    }
    return null; // null instead of throwing, other api endpoints might work, avoids breaking front-end
  }
}

async function getPopularMovies() {
  return getMovies(`${API_URL}/movie/popular`);
}

async function getNowPlayingMovies() {
  return getMovies(`${API_URL}/movie/now_playing`);
}

type MovieGenre = (typeof MOVIE_GENRES)[keyof typeof MOVIE_GENRES];

async function getMoviesByGenre(genre: MovieGenre) {
  return getMovies(`${API_URL}/discover/movie?with_genres=${genre}`);
}

export const getHomePageMoviesQuery = queryOptions({
  queryFn: getHomePageMovies,
  queryKey: ["homepage"],
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export async function getCloudMovieDetails(movieId: string) {
  const headers = new Headers();
  if (!process.env) return;
  headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
  const url = `${API_URL}/movie/${movieId}`;
  const response = await fetch(url, { headers });
  if (response && !response.ok) {
    throw new NotFoundError(movieId);
  }
  const parsedMovies = await response.json();
  return parsedMovies;
}
