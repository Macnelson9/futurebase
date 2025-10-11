"use client";

import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const totalLetters = 12;
  const unlockedLetters = 3;
  const pendingLetters = 9;

  const recentLetters = [
    {
      id: "1",
      title: "Message to Future Me",
      unlockTime: new Date(Date.now() + 86400000 * 30), // 30 days from now
      status: "pending",
    },
    {
      id: "2",
      title: "Birthday Reminder",
      unlockTime: new Date(Date.now() + 86400000 * 365), // 1 year from now
      status: "pending",
    },
    {
      id: "3",
      title: "Graduation Memory",
      unlockTime: new Date(Date.now() - 86400000 * 30), // 30 days ago
      status: "unlocked",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 mt-20">
            <Pill className="mb-6">YOUR DASHBOARD</Pill>
            <h1 className="text-4xl md:text-6xl font-sentient mb-8">
              Welcome Back, <span className="text-primary">Time Traveler</span>
            </h1>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="border border-primary/20 p-6 rounded-lg text-center">
              <div className="text-3xl font-mono text-primary mb-2">
                {totalLetters}
              </div>
              <div className="text-sm text-foreground/70 font-mono">
                TOTAL LETTERS
              </div>
            </div>
            <div className="border border-primary/20 p-6 rounded-lg text-center">
              <div className="text-3xl font-mono text-primary mb-2">
                {unlockedLetters}
              </div>
              <div className="text-sm text-foreground/70 font-mono">
                UNLOCKED
              </div>
            </div>
            <div className="border border-primary/20 p-6 rounded-lg text-center">
              <div className="text-3xl font-mono text-primary mb-2">
                {pendingLetters}
              </div>
              <div className="text-sm text-foreground/70 font-mono">
                PENDING
              </div>
            </div>
            <div className="border border-primary/20 p-6 rounded-lg text-center">
              <div className="text-3xl font-mono text-primary mb-2">∞</div>
              <div className="text-sm text-foreground/70 font-mono">
                MEMORIES
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* User Profile */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sentient">
                Profile Information
              </h2>
              <div className="border border-primary/20 p-6 rounded-lg space-y-4">
                {isConnected && address ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar
                        address={address}
                        chain={base}
                        className="w-16 h-16 border border-primary/20 rounded-full"
                      />
                      <div>
                        <Name
                          address={address}
                          chain={base}
                          className="font-mono text-primary text-lg"
                        />
                        <div className="text-sm text-foreground/70">
                          Base Profile
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-sm mb-2 text-foreground/70">
                        BASENAME
                      </label>
                      <Name
                        address={address}
                        chain={base}
                        className="font-mono text-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-sm mb-2 text-foreground/70">
                        WALLET ADDRESS
                      </label>
                      <div className="font-mono text-sm break-all">
                        {address}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-foreground/70 font-mono">
                      Please connect your wallet to view your profile
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <Link href="/write">
                    <Button className="w-full">[WRITE NEW LETTER]</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sentient">
                Recent Letters
              </h2>
              <div className="space-y-4">
                {recentLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="border border-primary/20 p-4 rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-mono text-primary">{letter.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-mono rounded ${
                          letter.status === "unlocked"
                            ? "bg-primary/20 text-primary"
                            : "bg-foreground/10 text-foreground/70"
                        }`}
                      >
                        {letter.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-foreground/70 font-mono">
                      Unlock: {letter.unlockTime.toLocaleDateString()}
                    </div>
                    {letter.status === "unlocked" && (
                      <Link href={`/letters/${letter.id}`}>
                        <Button size="sm" className="mt-2">
                          [READ LETTER]
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-sentient mb-8">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/write">
                <div className="border border-primary/20 p-8 rounded-lg hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="font-mono text-primary mb-2">WRITE LETTER</h3>
                  <p className="text-sm text-foreground/70">
                    Send a message to your future self
                  </p>
                </div>
              </Link>
              <Link href="/letters">
                <div className="border border-primary/20 p-8 rounded-lg hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    📬
                  </div>
                  <h3 className="font-mono text-primary mb-2">VIEW LETTERS</h3>
                  <p className="text-sm text-foreground/70">
                    Check your unlocked messages
                  </p>
                </div>
              </Link>
              <div className="border border-primary/20 p-8 rounded-lg hover:border-primary/40 transition-colors cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <h3 className="font-mono text-primary mb-2">SETTINGS</h3>
                <p className="text-sm text-foreground/70">
                  Manage your account preferences
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
