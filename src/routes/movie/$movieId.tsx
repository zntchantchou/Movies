import { createFileRoute } from "@tanstack/react-router";
// import { getMovieDetailsQuery } from "../../http/queries";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import "./MovieDetails.scss";

function MovieDetails() {
  console.log("Movie Details Page");
  return <p>I am a Movie</p>;
}

export const Route = createFileRoute(`/movie/$movieId`)({
  component: MovieDetails,
  errorComponent: ErrorPage,
  // loader: ({ context, params }) => {
  //   return context.queryClient.ensureQueryData({
  //     ...getMovieDetailsQuery(params.movieId),
  //     revalidateIfStale: true,
  //   });
  // },
});
