import { createFileRoute } from "@tanstack/react-router";
import { getHomePageMoviesQuery } from "../http/queries.server";
import { formatMovies } from "../utils/utils";
import Carousel from "../components/Carousel/Carousel";
import TopBanner from "../components/TopBanner/TopBanner";
import TopCarousel from "../components/TopCarousel/TopCarousel";

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
  const nowPlayingMovies = formatMovies(movies?.nowPlaying);

  return (
    <>
      {movies?.nowPlaying?.length && <TopBanner items={nowPlayingMovies} />}
      {movies?.nowPlaying?.length && <TopCarousel items={nowPlayingMovies} />}
      {movies?.popular?.length && (
        <Carousel title="Popular movies" items={popularMovies} />
      )}
      {movies?.documentaries?.length && (
        <Carousel title="Documentaries" items={documentaries} />
      )}
      {movies?.comedies?.length && (
        <Carousel title="Comedies" items={comedies} />
      )}
      {movies?.history?.length && (
        <Carousel title="History" items={historyMovies} />
      )}
    </>
  );
}
