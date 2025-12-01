import { createFileRoute } from "@tanstack/react-router";
import { getHomePageMoviesQuery } from "../http/queries.server";
import { formatMovies } from "../utils/utils";
import Carousel from "../components/Carousel/Carousel";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    // request is only made on the server + sent to cache
    return context.queryClient.ensureQueryData({
      ...getHomePageMoviesQuery,
      revalidateIfStale: true,
    });
  },
});

function Index() {
  const movies = Route.useLoaderData();
  const popularMovies = formatMovies(movies?.popular);
  const documentaries = formatMovies(movies?.documentaries);
  const comedies = formatMovies(movies?.comedies);
  const historyMovies = formatMovies(movies?.history);
  return (
    <>
      <Carousel title="Popular movies" items={popularMovies} />
      <Carousel title="Documentaries" items={documentaries} />
      <Carousel title="Comedies" items={comedies} />
      <Carousel title="History" items={historyMovies} />
    </>
  );
}
