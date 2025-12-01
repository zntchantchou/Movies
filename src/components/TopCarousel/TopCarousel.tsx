import { useRef, useEffect } from "react";
import "./TopCarousel.scss";
import type { ClientMovie } from "../../utils/utils";
import { useNavigate } from "@tanstack/react-router";

const IMAGES_URL = "https://image.tmdb.org/t/p/w1280";

interface TopCarouselProps {
  items: ClientMovie[];
}

function TopCarousel({ items }: TopCarouselProps) {
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
    <div
      ref={ref}
      className="carousel web-top-carousel"
      id="web-top-carousel"
      data-flickity="{ autoPlay: true }"
    >
      {items.map((movie) => (
        <TopCarouselItem item={movie} key={movie.id} />
      ))}
    </div>
  );
}

function TopCarouselItem({ item }: { item: ClientMovie }) {
  const navigate = useNavigate({ from: "/" });
  const imgUrl = `${IMAGES_URL + item.backdropPath}`;
  // const filmTitle =
  //   item.title.length > 25 ? `${item.title.slice(0, 22)}..` : item.title;
  return (
    <div
      id="web-cell"
      className="carousel-cell"
      onClick={() => {
        navigate({ to: `/movie/${item.id}` });
      }}
    >
      <img src={imgUrl} alt={item.title} />
      <div className="carousel-backdrop-caption">{item.title}</div>
      {/* <div className="title">{filmTitle}</div> */}
    </div>
  );
}
export default TopCarousel;
