import { useNavigate } from "@tanstack/react-router";
import Button from "../Button/Button";
import "./NotFound.scss";

function NotFoundComponent() {
  console.log("[NotFoundComponent]");
  const navigate = useNavigate();
  return (
    <div id="not-found">
      <div className="message">
        Sorry, the page you are looking for does not exist!
      </div>
      <Button text="Homepage" onClick={() => navigate({ to: "/" })} />
    </div>
  );
}

export default NotFoundComponent;
