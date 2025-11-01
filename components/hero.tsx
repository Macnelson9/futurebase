"use client";

import Link from "next/link";
import { GL } from "./gl";
import { Pill } from "./pill";
import { Stats } from "./stats";
import { Button } from "./ui/button";
import { useState } from "react";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const [statsHovering, setStatsHovering] = useState(false);
  return (
    <div className="flex flex-col h-svh justify-center">
      <GL hovering={hovering || statsHovering} />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block">
          <Stats onHoverChange={setStatsHovering} />
        </div>

        <div className="text-center">
          <Pill className="mb-6">ALPHA RELEASE</Pill>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
            Send Memories to <br />
            <i className="font-light">Your Future Self</i>
          </h1>
          <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
            Preserve your thoughts, dreams, and messages on the blockchain.
            Unlock them when the time is right.
          </p>

          <Link className="contents max-sm:hidden" href="/contact">
            <Button
              className="mt-14"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              [Contact Us]
            </Button>
          </Link>
          <Link className="contents sm:hidden" href="/contact">
            <Button
              size="sm"
              className="mt-14"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              [Contact Us]
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile: Stats pinned to bottom center of hero */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center lg:hidden z-20 pointer-events-auto">
        <Stats onHoverChange={setStatsHovering} />
      </div>
    </div>
  );
}
