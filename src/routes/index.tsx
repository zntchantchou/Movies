import { createFileRoute } from "@tanstack/react-router";
import { getHomePageMoviesQuery } from "../http/queries";
import { formatMovies } from "../utils/utils";
import Carousel from "../components/Carousel/Carousel";

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
  const formattedMovies = formatMovies(movies?.popular);
  // console.log("POPULAR MOVIE CLIENT: ", movies?.popular.length);
  // console.log("Formatted ", formattedMovies);
  // const carousel =
  //   typeof window !== "undefined" ? <Carousel items={formattedMovies} /> : null;
  return (
    <>
      <p>FACTS: </p>
      <Carousel items={formattedMovies} />
    </>
  );
}
