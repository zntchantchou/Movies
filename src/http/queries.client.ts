import { queryOptions } from "@tanstack/react-query";
import config from "../config";

const staleTimeAsMinutes = 120;

export async function getApiMovieDetails(movieId: string) {
  const headers = new Headers();
  try {
    // TODO avoid referring to localhost
    const url = `http://127.0.0.1:${config.port}/movie-details/${movieId}`;
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    return parsedMovies;
  } catch (e) {
    console.log("[getMovieDetails] error", e);
  }
}

export const getApiMovieDetailsQuery = (movieId: string) => {
  return queryOptions({
    queryFn: async () => getApiMovieDetails(movieId),
    queryKey: [`movie/${movieId}`],
    // refetching the movie details should only happen at most once per hour (24 times a day)
    staleTime: 1000 * 60 * staleTimeAsMinutes,
  });
};
