import { useEffect } from "react";

function Wishlist() {
  console.log("Wishlist");
  useEffect(() => {
    console.log("Wishlist useEffect");
  }, []);
  return <p>Wishlist</p>;
}

export default Wishlist;
