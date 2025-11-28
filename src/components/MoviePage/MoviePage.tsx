import type { MovieDetails } from "../../types/api";
import "./MoviePage.scss";

type MoviePageProps = { data: MovieDetails };

const MoviePage = ({ data }: MoviePageProps) => {
  if (!data) return null;

  const posterBase = "https://image.tmdb.org/t/p/w500";
  const backgroundBase = "https://image.tmdb.org/t/p/w1280";
  const {
    title,
    poster_path,
    backdrop_path,
    genres,
    overview,
    release_date,
    // runtime,
    vote_average,
    production_companies,
    spoken_languages,
    origin_country,
    popularity,
  } = data;

  // const formatRuntime = (min) => {
  //   const h = Math.floor(min / 60);
  //   const m = min % 60;
  //   return `${h}h ${m}m`;
  // };

  return (
    <div className="movie-details">
      {/* BACKDROP */}
      <div
        className="backdrop"
        style={{
          backgroundImage: `url(${backgroundBase}${backdrop_path})`,
        }}
      >
        <div className="overlay"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="content-wrapper">
        <div className="poster">
          <img src={`${posterBase}${poster_path}`} alt={title} />
        </div>

        <div className="info">
          <h1>{title}</h1>

          {/* TAGS */}
          <div className="meta">
            <span>{release_date}</span>
            <span>•</span>
            {/* <span>{formatRuntime(runtime)}</span> */}
            <span>•</span>
            <span>{origin_country?.join(", ")}</span>
          </div>

          {/* GENRES */}
          <div className="genres">
            {genres?.map((g) => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>

          {/* OVERVIEW */}
          <h2>Overview</h2>
          <p className="overview">{overview}</p>

          {/* EXTRA INFO */}
          <div className="stats">
            <div className="stat-item">
              <h3>Rating</h3>
              <p>{vote_average} / 10</p>
            </div>

            <div className="stat-item">
              <h3>Popularity</h3>
              <p>{popularity}</p>
            </div>

            <div className="stat-item">
              <h3>Spoken Languages</h3>
              <p>
                {spoken_languages
                  ?.map((l: { english_name: string }) => l.english_name)
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* PRODUCTION */}
          <div className="production">
            <h2>Production Companies</h2>
            <ul>
              {production_companies?.map((c) => (
                <li key={c.id}>
                  {c.logo_path && (
                    <img src={`${posterBase}${c.logo_path}`} alt={c.name} />
                  )}
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
