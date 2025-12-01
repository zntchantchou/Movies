// "use client";

import { useEffect, useRef } from "react";
import type { ClientMovie } from "../../utils/utils";
import "./Carousel.scss";
import { useNavigate } from "@tanstack/react-router";

interface CarouselProps {
  items: ClientMovie[];
  title: string;
}

const IMAGES_URL = "https://image.tmdb.org/t/p/w500";

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
      <div className="carousel-title">{title}</div>
      <div
        ref={ref}
        id="content-carousel"
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
  const navigate = useNavigate({ from: "/" });
  // const imgUrl = `url(${IMAGES_URL + item.posterPath})`;
  const imgUrl = `${IMAGES_URL + item.posterPath}`;
  const filmTitle =
    item.title.length > 25 ? `${item.title.slice(0, 20)}..` : item.title;
  return (
    <div
      className="carousel-cell"
      onClick={() => {
        navigate({ to: `/movie/${item.id}` });
      }}
    >
      <img src={imgUrl} alt={item.title} />
      <div className="title">{filmTitle}</div>
    </div>
  );
}

export default Carousel;
