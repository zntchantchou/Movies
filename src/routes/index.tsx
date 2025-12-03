import { createFileRoute } from "@tanstack/react-router";
import { getHomePageMoviesQuery } from "../http/queries.server";
import { formatMovies } from "../utils/utils";
import Carousel from "../components/Carousel/Carousel";
import TopBanner from "../components/TopBanner/TopBanner";
import TopCarousel from "../components/TopCarousel/TopCarousel";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    const staleTime = 12 * 60 * 60 * 1000;
    // request is made if there is no data in the cache, which is created at server build-time
    return context.queryClient.ensureQueryData({
      ...getHomePageMoviesQuery,
      staleTime,
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
