"use client";

import { useEffect, useState } from "react";
import { useFutureBaseContract } from "@/hooks/useFutureBaseContract";
import { useGraphQLStats } from "@/hooks/useGraphQL";
import { Button } from "@/components/ui/button";

interface StatsProps {
  onHoverChange?: (hovering: boolean) => void;
}

export function Stats({ onHoverChange }: StatsProps) {
  const { totalMemories } = useFutureBaseContract();
  const { data: graphQLData, isLoading: graphQLLoading } = useGraphQLStats();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalActiveUsers = graphQLData?.stats?.[0]?.totalActiveUsers || 0;

  useEffect(() => {
    // Simulate loading stats after page load
    const timer = setTimeout(() => {
      // Get unique users from localStorage
      const connectedUsers = JSON.parse(
        localStorage.getItem("connectedUsers") || "[]"
      );
      setTotalUsers(connectedUsers.length);
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex flex-row gap-4 lg:flex-col">
        <div className="text-center">
          <div className="w-24 h-8 bg-muted animate-pulse rounded mb-2"></div>
          <div className="w-16 h-4 bg-muted animate-pulse rounded mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="w-24 h-8 bg-muted animate-pulse rounded mb-2"></div>
          <div className="w-16 h-4 bg-muted animate-pulse rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 mt-5 position-absolute lg:flex-col">
      <div className="text-center">
        <Button
          className="h-10 w-24 flex items-center justify-center px-3"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          onTouchStart={() => onHoverChange?.(true)}
          onTouchEnd={() => onHoverChange?.(false)}
          onTouchCancel={() => onHoverChange?.(false)}
          onFocus={() => onHoverChange?.(true)}
          onBlur={() => onHoverChange?.(false)}
        >
          <span className="text-2xl font-bold text-primary">
            {totalMemories ? Number(totalMemories) : 0}
          </span>
        </Button>
        <p className="text-sm text-muted-foreground mt-2">Total Memories</p>
      </div>
      <div className="text-center">
        <Button
          className="h-10 w-24 flex items-center justify-center px-3"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          onTouchStart={() => onHoverChange?.(true)}
          onTouchEnd={() => onHoverChange?.(false)}
          onTouchCancel={() => onHoverChange?.(false)}
          onFocus={() => onHoverChange?.(true)}
          onBlur={() => onHoverChange?.(false)}
        >
          <span className="text-2xl font-bold text-primary">
            {graphQLLoading ? "..." : totalActiveUsers}
          </span>
        </Button>
        <p className="text-sm text-muted-foreground mt-2">Active Users</p>
      </div>
    </div>
  );
}
