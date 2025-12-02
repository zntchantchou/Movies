import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import "./MovieDetails.scss";
import { getApiMovieDetailsQuery } from "../../http/queries.client";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import MoviePage from "../../components/MoviePage/MoviePage";

export const Route = createFileRoute(`/movie/$movieId`)({
  component: MovieDetails,
});

function MovieDetails() {
  const { movieId } = Route.useParams();
  const { isPending, isError, data, error } = useQuery(
    getApiMovieDetailsQuery(movieId)
  );
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError || (data && data.success === false)) {
    return <ErrorPage msg={error?.message || data?.status_message} />;
  }

  console.log("Movie Details Page", isPending, isError, data);
  return <MoviePage data={data} />;
}
