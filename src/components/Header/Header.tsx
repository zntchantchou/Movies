import { useNavigate } from "@tanstack/react-router";
import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div onClick={() => navigate({ to: "/" })} id="website-title">
        Movies
      </div>
      {/* <Link to="/wishlist">Wishlist</Link> */}
    </div>
  );
}

export default Header;
