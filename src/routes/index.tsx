import { createFileRoute } from "@tanstack/react-router";
import { getHomePageMoviesQuery } from "../http/queries";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    // console.log("Content in loader :", context.queryClient);
    // request is only made on the server + sent to cache
    return context.queryClient.ensureQueryData({
      ...getHomePageMoviesQuery,
      revalidateIfStale: true,
    });
  },
});

function Index() {
  const movies = Route.useLoaderData();
  // const formattedMovies = formatMovies(popularMovies);
  console.log("POPULAR MOVIE CLIENT: ", movies?.popular.length);
  // console.log("Formatted ", formattedMovies);
  return (
    <>
      <p>FACTS: </p>
    </>
  );
}
