// "use client";

import { useEffect, useRef } from "react";
import type { ClientMovie } from "../../utils/utils";
import "./Carousel.scss";

interface CarouselProps {
  items: ClientMovie[];
  title: string;
}
const IMAGES_URL = "https://image.tmdb.org/t/p/w154";

function Carousel({ items, title }: CarouselProps) {
  const ref = useRef(null);
  const initFlickity = async () => {
    const Flickity = (await import("flickity")).default;
    if (ref.current)
      new Flickity(ref.current, {
        lazyLoad: false,
        wrapAround: true,
      });
  };

  useEffect(() => {
    console.log("Carousel useEffect!!");
    if (ref.current) initFlickity();
  }, []);

  return (
    <>
      <div>{title}</div>
      <div
        ref={ref}
        className="carousel"
        data-flickity='{ "groupCells": true }'
      >
        {items.map((movie) => (
          <CarouselItem item={movie} key={movie.id} />
        ))}
      </div>
    </>
  );
}

function CarouselItem({ item }: { item: ClientMovie }) {
  return (
    <div
      className="carousel-cell"
      style={{
        backgroundImage: `url(${IMAGES_URL + item.posterPath})`,
      }}
    >
      {/* <div
        className="movie-poster"
        style={{
          backgroundImage: `url(${IMAGES_URL + item.posterPath})`,
        }}
      ></div> */}
      <span>{item.title}</span>
    </div>
  );
}

export default Carousel;
