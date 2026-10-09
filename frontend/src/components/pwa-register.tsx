"use client";

import { useEffect } from "react";
import { HummingbirdOverlay } from "@/components/hummingbird/hummingbird-overlay";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA support is progressive; the storefront remains fully usable without it.
    });
  }, []);

  return <HummingbirdOverlay />;
}
