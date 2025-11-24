interface Props {
  items: CarouselItem[];
}

type CarouselItem = {
  title: string;
  imageUrl: string;
  releaseDate: string;
  description: string;
  id: number;
};

function Carousel(props: Props) {
  return <p>Carousel</p>;
}

export default Carousel;
