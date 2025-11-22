import { useEffect } from "react";
// interface MovieDetailsProps {
//   id: string
// }

function MovieDetails() {
  console.log("MovieDetails 1");
  useEffect(() => {
    console.log("MovieDetails useffect");
  }, []);

  return (
    <>
      <h1>Movie Details Page</h1>
    </>
  );
}

export default MovieDetails;
