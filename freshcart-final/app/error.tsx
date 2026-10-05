"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container empty page">
      <h2>Something went wrong</h2>

      <p className="muted">{error.message}</p>

      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
