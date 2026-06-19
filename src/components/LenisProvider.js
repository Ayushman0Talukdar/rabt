"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

export default function LenisProvider({ children }) {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <ReactLenis root>{children}</ReactLenis>;
}
