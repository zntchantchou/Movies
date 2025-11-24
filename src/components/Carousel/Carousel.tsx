// "use client";

import { useEffect, useRef } from "react";
import type { ClientMovie } from "../../utils/utils";
import "./Carousel.scss";

interface CarouselProps {
  items: ClientMovie[];
}
const IMAGES_URL = "https://image.tmdb.org/t/p/w500";

function Carousel({ items }: CarouselProps) {
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
    <div ref={ref} className="carousel" data-flickity='{ "groupCells": true }'>
      {items.map((movie) => (
        <CarouselItem item={movie} key={movie.id} />
      ))}
    </div>
  );
}

function CarouselItem({ item }: { item: ClientMovie }) {
  return (
    <div className="carousel-cell">
      <span>{item.title}</span>
    </div>
  );
}

export default Carousel;
