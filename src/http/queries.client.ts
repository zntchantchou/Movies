import { queryOptions } from "@tanstack/react-query";

const staleTimeAsMinutes = 120;

export async function getApiMovieDetails(movieId: string) {
  const headers = new Headers();
  console.log("import.meta.env ", import.meta.env);
  const url = `http://127.0.0.1:${import.meta.env.VITE_APP_PORT}/movie-details/${movieId}`;
  const response = await fetch(url, { headers });
  const data = await response.json();
  if (data?.isError) throw data;
  return data;
}

export const getApiMovieDetailsQuery = (movieId: string) => {
  return queryOptions({
    queryFn: async () => getApiMovieDetails(movieId),
    queryKey: [`movie/${movieId}`],
    retry: 0,
    // refetching the movie details should only happen at most once per hour (24 times a day)
    staleTime: 1000 * 60 * staleTimeAsMinutes,
  });
};
