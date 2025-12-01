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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    const nextImageTicker = window.setInterval(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentIndex == items.length - 1) setCurrentIndex(0);
    }, 10000);
    return () => {
      window.clearInterval(nextImageTicker);
    };
  }, [currentIndex, setCurrentIndex, items.length]);
  const imgUrl = `url(${IMAGES_URL}${items[currentIndex].posterPath})`;
  {
    /* Render two items, one for mobile and one for web, display alternately using MQ*/
  }
  return (
    <div
      className="banner-mobile-overlay"
      onClick={() => {
        navigate({ to: `/movie/${items[currentIndex].id}` });
      }}
    >
      <div className="backdrop" style={{ backgroundImage: imgUrl }}></div>
      <div className="backdrop-caption">{items[currentIndex].title}</div>
    </div>
  );
}

export default TopBanner;
