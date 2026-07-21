"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          background: "#fafafa",
          color: "#09090b",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#71717a", maxWidth: "28rem" }}>
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "0.5rem",
            background: "#2563eb",
            color: "#fff",
            padding: "0.625rem 1.25rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
