"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function MiniAppInitializer() {
  useEffect(() => {
    // Give the page content time to render before calling ready
    // This ensures all providers and content are mounted first
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log("MiniApp ready signal sent");
      } catch (error) {
        console.error("Failed to call sdk.actions.ready():", error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
