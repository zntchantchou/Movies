import { createFileRoute } from "@tanstack/react-router";
import { getPopularMoviesQuery } from "../http/queries";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    // console.log("Content in loader :", context.queryClient);
    // request is only made on the server + sent to cache
    return context.queryClient.ensureQueryData({
      ...getPopularMoviesQuery,
      revalidateIfStale: true,
    });
  },
});

function Index() {
  const popularMovies = Route.useLoaderData();
  console.log("POPULAR MOVIE CLIENT: ", popularMovies);
  return (
    <>
      <p>FACTS: </p>
      {/* <ClientComp /> */}
    </>
  );
}
