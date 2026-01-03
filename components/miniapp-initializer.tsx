"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function MiniAppInitializer() {
  useEffect(() => {
    // Call sdk.actions.ready() to hide the loading splash screen
    // and display the app once it's ready
    sdk.actions.ready();
  }, []);

  return null;
}
