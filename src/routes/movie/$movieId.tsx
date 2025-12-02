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
  const hasError = isError || (data && data.success === false) || data?.error;
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (hasError) {
    return (
      <ErrorPage msg={error?.message || data?.status_message || data?.error} />
    );
  }
  return <MoviePage data={data} />;
}
