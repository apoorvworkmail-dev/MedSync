import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="simple-page not-found-page">
      <h1>404 Page Not Found</h1>
      <p>The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </main>
  );
}

export default NotFound;
