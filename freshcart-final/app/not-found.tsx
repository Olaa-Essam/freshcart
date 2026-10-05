import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty page">
      <h2>Page not found</h2>

      <p className="muted">
        The page you are looking for does not exist.
      </p>

      <Link className="btn" href="/">
        Back to home
      </Link>
    </div>
  );
}
