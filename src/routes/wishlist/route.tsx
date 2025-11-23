import { createFileRoute } from "@tanstack/react-router";

function Wishlist() {
  console.log("Wishlist");
  return <p>Wishlist</p>;
}

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
});
