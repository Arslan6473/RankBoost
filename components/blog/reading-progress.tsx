"use client";

import { useEffect, useState } from "react";

/** A thin progress bar that fills as the reader scrolls the article. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
