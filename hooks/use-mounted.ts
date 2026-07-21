"use client";

import { useEffect, useState } from "react";

/** True after the component has mounted on the client (hydration-safe). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
