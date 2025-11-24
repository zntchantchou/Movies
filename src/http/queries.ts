import { queryOptions } from "@tanstack/react-query";

const MOVIE_GENRES = {
  animation: 16,
  action: 28,
  documentary: 99,
};

const API_URL = "https://api.themoviedb.org/3";

async function getTodos() {
  try {
    const response = await fetch("https://dummyjson.com/todos");
    console.log("[getTodos] RUNNING ==> NOT CACHED");
    return response.json();
  } catch (e) {
    console.log("[getTodos] ", e);
  }
}

const staleTimeAsMinutes = 120;

export const getTodosQuery = queryOptions({
  queryFn: getTodos,
  queryKey: ["todos"],
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});

async function getHomePageMovies() {
  // try to still return value if there is an error.
  // Also send an error if there is one
  try {
    const documentaries = await getDocumentaries();
    const popularMovies = await getPopularMovies();
    return { documentaries, popular: popularMovies };
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
    console.log("[getPopularMovies] RUNNING ==> NOT CACHED", parsedMovies);
    return parsedMovies.results;
  } catch (e) {
    console.log("[getPopularMovies] ", e);
  }
}

async function getDocumentaries() {
  const headers = new Headers();
  if (process.env)
    headers.append("Authorization", `Bearer ${process.env?.TOKEN}`);
  try {
    const url = `${API_URL}/discover/movie?with_genres=${MOVIE_GENRES.documentary}`;
    const response = await fetch(url, { headers });
    const parsedMovies = await response.json();
    console.log("[getDocumentaries] RUNNING ==> NOT CACHED");
    return parsedMovies.results;
  } catch (e) {
    console.log("[getDocumentaries] ", e);
  }
}

// export const getPopularMoviesQuery = queryOptions({
//   queryFn: getPopularMovies,
//   queryKey: ["popularMovies"],
//   // refetching the movies on the home page should only happen at most once per hour (24 times a day)
//   staleTime: 1000 * 60 * staleTimeAsMinutes,
// });

export const getHomePageMoviesQuery = queryOptions({
  queryFn: getHomePageMovies,
  queryKey: ["homepage"],
  // refetching the movies on the home page should only happen at most once per hour (24 times a day)
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});
