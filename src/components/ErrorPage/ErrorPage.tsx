import { useNavigate } from "@tanstack/react-router";
import Button from "../Button/Button";
import "./ErrorPage.scss";

type ErrorPageProps = {
  msg?: string;
};
function ErrorPage({ msg }: ErrorPageProps) {
  const navigate = useNavigate();
  const errorMsg = msg ? <span className="error-message">{msg}</span> : null;
  return (
    <div className="details-error-root">
      <div className="details-error-content">
        <span className="default-message">Sorry, an error has occured!</span>
        {errorMsg}
        <Button text="Homepage" onClick={() => navigate({ to: "/" })} />
      </div>
    </div>
  );
}

export default ErrorPage;
