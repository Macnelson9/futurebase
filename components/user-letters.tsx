"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Clock, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useFutureBaseContract } from "@/hooks/useFutureBaseContract";
import { useIPFS } from "@/hooks/useIPFS";
import {
  generateKeyFromWallet,
  decryptLetter,
  EncryptedData,
} from "@/lib/encryption";
import { Address } from "viem";

interface Letter {
  id: number;
  owner: string;
  ipfsHash: string;
  releaseTime: number;
  delivered: boolean;
  createdAt: number;
  isAvailable: boolean;
}

export function UserLetters() {
  const { address } = useAccount();
  const { toast } = useToast();
  const {
    userLetters,
    getLetterDetails,
    claimLetter,
    isLoading: contractLoading,
  } = useFutureBaseContract();
  const { fetchFromIPFS, isUploading } = useIPFS();

  const [letters, setLetters] = useState<Letter[]>([]);
  const [loadingLetters, setLoadingLetters] = useState(true);
  const [revealingLetter, setRevealingLetter] = useState<number | null>(null);
  const [revealedContent, setRevealedContent] = useState<string>("");

  useEffect(() => {
    if (userLetters && address) {
      loadLetterDetails();
    }
  }, [userLetters, address]);

  const loadLetterDetails = async () => {
    if (!userLetters) return;

    setLoadingLetters(true);
    try {
      const letterPromises = userLetters.map(async (letterId) => {
        const details = await getLetterDetails(Number(letterId));
        console.log(details);
        return {
          id: Number(letterId),
          owner: details[0] as Address,
          ipfsHash: details[1],
          releaseTime: Number(details[2]),
          delivered: details[3],
          createdAt: Number(details[4]),
          isAvailable: details[5],
        } as Letter;
      });

      const letterDetails = await Promise.all(letterPromises);
      setLetters(letterDetails);
    } catch (error) {
      console.error("Error loading letter details:", error);
      toast({
        title: "Error",
        description: "Failed to load letter details",
        variant: "destructive",
      });
    } finally {
      setLoadingLetters(false);
    }
  };

  const handleRevealLetter = async (letter: Letter) => {
    if (!address) return;

    setRevealingLetter(letter.id);
    try {
      // First claim the letter to get the IPFS hash
      await claimLetter(letter.id);

      // Generate decryption key
      const key = await generateKeyFromWallet(address);

      // Fetch encrypted data from IPFS
      const encryptedData: EncryptedData = await fetchFromIPFS(letter.ipfsHash);

      // Decrypt the content
      const content = await decryptLetter(encryptedData, key);

      setRevealedContent(content);

      toast({
        title: "Letter Revealed!",
        description: "Your message from the past has been decrypted",
      });

      // Refresh letters to update status
      loadLetterDetails();
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

  if (loadingLetters) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading your letters...</span>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>You haven't created any time travel letters yet.</p>
        <p className="text-sm mt-2">Create your first letter above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {letters.map((letter) => (
        <Card key={letter.id} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Letter #{letter.id}</CardTitle>
              <Badge
                variant={
                  letter.delivered
                    ? "default"
                    : letter.isAvailable
                    ? "secondary"
                    : "outline"
                }
              >
                {letter.delivered ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Delivered
                  </>
                ) : letter.isAvailable ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
            </div>
            <CardDescription>
              Created on {format(new Date(letter.createdAt * 1000), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Release Date:</strong>{" "}
                {format(new Date(letter.releaseTime * 1000), "PPP 'at' p")}
              </div>

              {letter.isAvailable && !letter.delivered && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => handleRevealLetter(letter)}
                      disabled={
                        revealingLetter === letter.id || contractLoading
                      }
                      className="w-full"
                    >
                      {revealingLetter === letter.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Revealing...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Reveal Letter
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Your Time Travel Message</DialogTitle>
                      <DialogDescription>
                        From {format(new Date(letter.createdAt * 1000), "PPP")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {revealedContent || "Loading your message..."}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {!letter.isAvailable && !letter.delivered && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Available in{" "}
                  {Math.ceil((letter.releaseTime - Date.now() / 1000) / 86400)}{" "}
                  days
                </div>
              )}
            </div>
          </CardContent>

          {/* Floating animation for revealed letters */}
          {letter.delivered && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
          )}
        </Card>
      ))}
    </div>
  );
}
