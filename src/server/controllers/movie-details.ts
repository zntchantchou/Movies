import type { NextFunction, Request, Response } from "express";
import cache from "../../cache.ts";
import { getCloudMovieDetails } from "../../http/queries.server.ts";

async function getMovieDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // id must be validated
  // send error if input is not exactly seven digit integer
  // only allow access from the client (using a key that should not appear on the front-end?) filter req.origin using domain-name + page?
  const movieId = req.params.id;
  const isValidId = /^\d{3,7}$/.test(req.params.id);
  console.log("IS VALID ", isValidId);
  if (!isValidId) {
    // send to middleware
    throw Error("The movie id is invalid", {
      cause: `Request with the following id was received by the server: ${movieId}`,
    });
  }
  const cached = cache.get(movieId);
  if (cached) return res.send(cached);
  let movieData;
  try {
    movieData = await getCloudMovieDetails(movieId);
    cache.set(movieId, movieData);
  } catch (e) {
    console.log("ERROR FETCHING MOVIE DETAILS ", e);
    next(e);
  }
  return res.send(movieData);
}

export default getMovieDetails;
