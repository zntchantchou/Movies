import { queryOptions } from "@tanstack/react-query";

const movieGenres = {
  animation: 16,
  action: 28,
  documentary: 99,
};

const API_URL = "https://api.themoviedb.org/3";
const IMAGES_URL = "https://image.tmdb.org/t/p/w500";

async function getTodos() {
  try {
    const response = await fetch("https://dummyjson.com/todos");
    console.log("[getTodos] RUNNING ==> NOT CACHED");
    return response.json();
  } catch (e) {
    console.log("[getTodos] ", e);
  }
}

const staleTimeAsMinutes = 60;

export const getTodosQuery = queryOptions({
  queryFn: getTodos,
  queryKey: ["todos"],
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});

async function getPopularMovies() {
  const headers = new Headers();
  if (process.env)
    headers.append("Authorization", `Bearer ${process?.env?.TOKEN}`);
  try {
    const url = `${API_URL}/movie/popular`;
    const response = await fetch(url, { headers });
    console.log("[getPopularMovies] RUNNING ==> NOT CACHED");
    return response.json();
  } catch (e) {
    console.log("[getPopularMovies] ", e);
  }
}

export const getPopularMoviesQuery = queryOptions({
  queryFn: getPopularMovies,
  queryKey: ["popularMovies"],
  // refetching the movies on the home page should only happen at most once per hour (24 times a day)
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});
