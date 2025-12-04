import type { NextFunction, Request, Response } from "express";
import cache from "../../cache.ts";
import { getCloudMovieDetails } from "../../http/queries.server.ts";
import InvalidInputError from "../errors/InvalidInput.ts";

async function getMovieDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const movieId = req.params.id;
  const isValidId = /^\d{3,7}$/.test(req.params.id);
  if (!isValidId) {
    throw new InvalidInputError(
      `Request with the following id was received: ${movieId}`
    );
  }
  const cached = cache.get(movieId);
  if (cached) return res.send(cached);
  let movieData;
  try {
    movieData = await getCloudMovieDetails(movieId);
    cache.set(movieId, movieData);
  } catch (e) {
    next(e);
  }
  return res.send(movieData);
}

export default getMovieDetails;
