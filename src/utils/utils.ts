import rateLimit from "express-rate-limit";

type ApiMovie = {
  title: string;
  id: number;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  original_language: string;
  original_title: string;
};
export type ClientMovie = {
  title: string;
  id: number;
  posterPath: string;
  backdropPath: string;
  description: string;
  releaseDate: string;
  voteAverage: number;
  originalLanguage: string;
  originalTitle: string;
};

export function formatMovies(movies: ApiMovie[]): ClientMovie[] {
  if (!movies || !movies.length) return [];
  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.overview,
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    releaseDate: m.release_date,
    originalLanguage: m.original_language,
    originalTitle: m.original_title,
    voteAverage: m.vote_average,
  }));
}

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // per minute
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
