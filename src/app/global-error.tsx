"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-ZM">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#050A14",
          color: "#F5F8FF",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
            copr
          </p>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 500, marginTop: 16 }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.75, fontSize: "0.925rem", marginTop: 8 }}>
            A critical error stopped the page from rendering.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              border: 0,
              borderRadius: 999,
              padding: "0.75rem 1.5rem",
              background: "#1E5EFF",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
