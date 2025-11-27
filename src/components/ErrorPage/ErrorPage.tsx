import "./ErrorPage.scss";

// type DetailsPageProps = {
//   msg: string;
// };
function ErrorPage() {
  return (
    <div className="details-error-root">
      <div className="details-error-content">
        <span>
          An error has occured, we were not able to find the content you were
          looking for!
        </span>
        {/* {msg} */}
      </div>
    </div>
  );
}

export default ErrorPage;
