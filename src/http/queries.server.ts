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
  // try to still return value if there is an error.
  // Also send an error if there is one
  // Also promise.all the whole thing
  const documentaries = await getMoviesByGenre(MOVIE_GENRES.DOCUMENTARY);
  const comedies = await getMoviesByGenre(MOVIE_GENRES.COMEDY);
  const history = await getMoviesByGenre(MOVIE_GENRES.HISTORY);
  const popularMovies = await getPopularMovies();
  const nowPlayingMovies = await getNowPlayingMovies();
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
    // log error to logfile
    console.log(`[getMovies]:  ${url}`, e);
    // null instead of throwing, other api endpoints might work, avoids breaking front-end
    return null;
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
