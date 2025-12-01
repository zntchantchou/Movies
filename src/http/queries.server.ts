import { queryOptions } from "@tanstack/react-query";

const MOVIE_GENRES = {
  ANIMATION: 16,
  ACTION: 28,
  DOCUMENTARY: 99,
  COMEDY: 35,
  HISTORY: 36,
} as const;

const API_URL = "https://api.themoviedb.org/3";

const staleTimeAsMinutes = 120;

async function getHomePageMovies() {
  // try to still return value if there is an error.
  // Also send an error if there is one
  // Also promise.all the whole thing
  try {
    const documentaries = await getMoviesByGenre(MOVIE_GENRES.DOCUMENTARY);
    const comedies = await getMoviesByGenre(MOVIE_GENRES.COMEDY);
    const history = await getMoviesByGenre(MOVIE_GENRES.HISTORY);
    const popularMovies = await getPopularMovies();
    return { documentaries, popular: popularMovies, comedies, history };
  } catch (e) {
    console.log("Error in getHomePageMovies : ", e);
  }
}

async function getPopularMovies() {
  const headers = new Headers();
  if (process.env)
    headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
  try {
    const url = `${API_URL}/movie/popular`;
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    console.log("[getPopularMovies] RUNNING ==> NOT CACHED");
    return parsedMovies.results;
  } catch (e) {
    console.log("[getPopularMovies] ", e);
  }
}

type MovieGenre = (typeof MOVIE_GENRES)[keyof typeof MOVIE_GENRES];
async function getMoviesByGenre(genre: MovieGenre) {
  const headers = new Headers();
  if (process.env)
    headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
  try {
    const url = `${API_URL}/discover/movie?with_genres=${genre}`;
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    console.log("[getMoviesByGenre] RUNNING ==> NOT CACHED");
    console.log("[getMoviesByGenre] GENRE ==> ", genre);
    return parsedMovies.results;
  } catch (e) {
    console.log("[getDocumentaries] ", e);
  }
}

export const getHomePageMoviesQuery = queryOptions({
  queryFn: getHomePageMovies,
  queryKey: ["homepage"],
  // refetching the movies on the home page should only happen at most once per hour (24 times a day)
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});

export async function getCloudMovieDetails(movieId: string) {
  const headers = new Headers();
  if (process.env)
    headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
  try {
    const url = `${API_URL}/movie/${movieId}`;
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    return parsedMovies;
  } catch (e) {
    console.log("[getMovieDetails] error", e);
  }
}
