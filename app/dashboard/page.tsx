"use client";

import { Pill } from "@/components/pill";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFutureBaseContract } from "@/hooks/useFutureBaseContract";
import { useIPFS } from "@/hooks/useIPFS";
import {
  generateKeyFromWallet,
  decryptLetter,
  EncryptedData,
} from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";

interface LetterData {
  id: string;
  title: string;
  unlockTime: Date;
  status: "pending" | "unlocked";
  ipfsHash: string;
  owner: string;
  delivered: boolean;
  createdAt: Date;
  isAvailable: boolean;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { userLetters, getLetterDetails, claimLetter } =
    useFutureBaseContract();
  const { fetchFromIPFS } = useIPFS();
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealingLetter, setRevealingLetter] = useState<number | null>(null);
  const [revealedContents, setRevealedContents] = useState<
    Record<number, string>
  >({});
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);

  useEffect(() => {
    const fetchLetters = async () => {
      if (!address || !userLetters) return;

      try {
        type LetterDetails = {
          releaseTime: bigint | number | string;
          isAvailable: boolean;
          ipfsHash: string;
          owner: string;
          delivered: boolean;
          createdAt: bigint | number | string;
        };

        const letterPromises = userLetters.map(async (letterId: bigint) => {
          const details = await getLetterDetails(Number(letterId));
          console.log("Letter details for ID", letterId, ":", details);

          // Type assertion for the contract return value
          const letterDetails = details as [
            `0x${string}`, // owner
            string, // ipfsHash
            bigint, // releaseTime
            boolean, // delivered
            bigint, // createdAt
            boolean // isAvailable
          ];

          // Convert to number safely, handling BigInt and other formats
          const releaseTimeNum =
            typeof letterDetails[2] === "bigint"
              ? Number(letterDetails[2])
              : Number(letterDetails[2]);
          const createdAtNum =
            typeof letterDetails[4] === "bigint"
              ? Number(letterDetails[4])
              : Number(letterDetails[4]);

          return {
            id: letterId.toString(),
            title: `Letter #${letterId.toString()}`,
            unlockTime: new Date(releaseTimeNum * 1000),
            status: letterDetails[3] ? "unlocked" : "pending",
            ipfsHash: letterDetails[1], // IPFS hash (may be empty if not released)
            owner: letterDetails[0],
            delivered: letterDetails[3],
            createdAt: new Date(createdAtNum * 1000),
            isAvailable: letterDetails[5],
          } as LetterData;
        });

        const fetchedLetters = await Promise.all(letterPromises);
        setLetters(fetchedLetters);
      } catch (error) {
        console.error("Error fetching letters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [address, userLetters, getLetterDetails]);

  const totalLetters = letters.length;
  const unlockedLetters = letters.filter((letter) => letter.delivered).length;
  const pendingLetters = totalLetters - unlockedLetters;

  // Slider logic - show all letters in a horizontal scrollable row
  const lettersPerView = 3;
  const totalSlides = Math.max(1, Math.ceil(letters.length / lettersPerView));

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide effect
  useEffect(() => {
    if (letters.length <= lettersPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [letters.length, lettersPerView, nextSlide]);

  const handleRevealLetter = async (letter: LetterData) => {
    if (!address) return;

    setSelectedLetter(letter);
    setRevealingLetter(Number(letter.id));
    try {
      let ipfsHash: string;

      if (letter.delivered) {
        // For already delivered letters, use the IPFS hash from the letter object
        ipfsHash = letter.ipfsHash;
      } else {
        // For new letters, claim to get the IPFS hash
        ipfsHash = await claimLetter(Number(letter.id));
      }

      // Generate decryption key
      const key = await generateKeyFromWallet(address);

      // Fetch encrypted data from IPFS using the hash
      if (
        !ipfsHash ||
        (typeof ipfsHash === "string" && ipfsHash.trim() === "")
      ) {
        throw new Error("IPFS hash is empty or undefined");
      }
      const encryptedData: EncryptedData = await fetchFromIPFS(ipfsHash);

      // Decrypt the content
      const content = await decryptLetter(encryptedData, key);

      setRevealedContents((prev) => ({
        ...prev,
        [Number(letter.id)]: content,
      }));

      toast({
        title: letter.delivered ? "Letter Loaded!" : "Letter Revealed!",
        description: letter.delivered
          ? "Your message from the past has been loaded"
          : "Your message from the past has been decrypted",
      });

      // Refresh letters to update status (only for new claims)
      if (!letter.delivered) {
        // Refetch letters
        const updatedLetters = await Promise.all(
          userLetters!.map(async (letterId: bigint) => {
            const details = await getLetterDetails(Number(letterId));
            const letterDetails = details as [
              `0x${string}`,
              string,
              bigint,
              boolean,
              bigint,
              boolean
            ];

            const releaseTimeNum =
              typeof letterDetails[2] === "bigint"
                ? Number(letterDetails[2])
                : Number(letterDetails[2]);
            const createdAtNum =
              typeof letterDetails[4] === "bigint"
                ? Number(letterDetails[4])
                : Number(letterDetails[4]);

            return {
              id: letterId.toString(),
              title: `Letter #${letterId.toString()}`,
              unlockTime: new Date(releaseTimeNum * 1000),
              status: letterDetails[3] ? "unlocked" : "pending",
              ipfsHash: letterDetails[1],
              owner: letterDetails[0],
              delivered: letterDetails[3],
              createdAt: new Date(createdAtNum * 1000),
              isAvailable: letterDetails[5],
            } as LetterData;
          })
        );
        setLetters(updatedLetters);
      }
    } catch (error) {
      console.error("Error revealing letter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reveal letter",
        variant: "destructive",
      });
    } finally {
      setRevealingLetter(null);
    }
  };

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
                  <Link href="/time-travel">
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
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-foreground/70 font-mono">
                      Loading your letters...
                    </div>
                  </div>
                ) : letters.length > 0 ? (
                  <div className="space-y-4">
                    {/* Slider Container */}
                    <div className="relative">
                      <div className="overflow-hidden">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                          }}
                        >
                          {Array.from(
                            { length: totalSlides },
                            (_, slideIndex) => (
                              <div
                                key={slideIndex}
                                className="flex-shrink-0 w-full space-y-4"
                              >
                                {letters
                                  .slice(
                                    slideIndex * lettersPerView,
                                    (slideIndex + 1) * lettersPerView
                                  )
                                  .map((letter) => (
                                    <div
                                      key={letter.id}
                                      className="border border-primary/20 p-4 rounded-lg hover:border-primary/40 transition-colors cursor-pointer"
                                      onClick={() => handleRevealLetter(letter)}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-mono text-primary">
                                          {letter.title}
                                        </h3>
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
                                        {letter.delivered
                                          ? "Unlocked"
                                          : "Unlock"}
                                        :{" "}
                                        {letter.unlockTime.toLocaleDateString() !==
                                        "Invalid Date"
                                          ? letter.unlockTime.toLocaleDateString()
                                          : "Date not available"}
                                      </div>
                                      {letter.status === "unlocked" && (
                                        <Button
                                          size="sm"
                                          className="mt-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRevealLetter(letter);
                                          }}
                                        >
                                          [READ LETTER]
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Navigation Dots */}
                      {totalSlides > 1 && (
                        <div className="flex justify-center space-x-2 mt-4">
                          {Array.from({ length: totalSlides }, (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentSlide
                                  ? "bg-primary"
                                  : "bg-primary/30"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Navigation Arrows */}
                      {totalSlides > 1 && (
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={prevSlide}
                            className="px-3"
                          >
                            ‹
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={nextSlide}
                            className="px-3"
                          >
                            ›
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-foreground/70 font-mono">
                      No letters found. Create your first time capsule!
                    </div>
                  </div>
                )}

                {/* Letter Content Dialog */}
                {selectedLetter && (
                  <Dialog
                    open={!!selectedLetter}
                    onOpenChange={() => setSelectedLetter(null)}
                  >
                    <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border-border/50">
                      <DialogHeader>
                        <DialogTitle>Your Time Travel Message</DialogTitle>
                        <DialogDescription>
                          From {selectedLetter.createdAt.toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 p-6 bg-muted/80 backdrop-blur-sm rounded-lg border border-border/50">
                        {revealedContents[Number(selectedLetter.id)] ? (
                          (() => {
                            try {
                              const messageData = JSON.parse(
                                revealedContents[Number(selectedLetter.id)]
                              );
                              return (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Recipient Email
                                    </h4>
                                    <p className="text-sm">
                                      {messageData.recipientEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Message
                                    </h4>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                      {messageData.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            } catch (error) {
                              // Fallback if not JSON
                              return (
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {revealedContents[Number(selectedLetter.id)]}
                                </p>
                              );
                            }
                          })()
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Loading your message...
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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
