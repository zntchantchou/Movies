import { queryOptions } from "@tanstack/react-query";

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

// refetching the movies on the home page should only happen at most once per hour (24 times a day)
export const getTodosQuery = queryOptions({
  queryFn: getTodos,
  queryKey: ["todos"],
  staleTime: 1000 * 60 * staleTimeAsMinutes,
});
