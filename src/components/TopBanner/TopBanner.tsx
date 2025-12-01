// "use client";

import { useEffect, useState } from "react";
import type { ClientMovie } from "../../utils/utils";
import "./TopBanner.scss";
import { useNavigate } from "@tanstack/react-router";

interface CarouselProps {
  items: ClientMovie[];
}

const IMAGES_URL = "https://image.tmdb.org/t/p/w1280";

function TopBanner({ items }: CarouselProps) {
  const [currentMovie, setCurrentMovie] = useState<ClientMovie>(items[0]);
  useEffect(() => {
    console.log("Iam the top banner ", currentMovie);
  }, []);
  const imgUrl = `url(${IMAGES_URL}${currentMovie.backdropPath})`;
  {
    /* Render two items, one for mobile and one for web, display alternately using MQ*/
  }
  return (
    <div className="banner-overlay">
      <div className="backdrop" style={{ backgroundImage: imgUrl }}></div>
      <div className="backdrop-caption">{currentMovie.title}</div>
    </div>
  );
}

function CarouselItem({ item }: { item: ClientMovie }) {
  const navigate = useNavigate({ from: "/" });
  const imgUrl = `url(${IMAGES_URL + item.posterPath})`;
  return (
    <div>
      <img src={imgUrl} alt={item.title} />
    </div>
  );
}

export default TopBanner;
