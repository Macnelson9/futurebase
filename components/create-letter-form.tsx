"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFutureBaseContract } from "@/hooks/useFutureBaseContract";
import { useIPFS } from "@/hooks/useIPFS";
import { generateKeyFromWallet, encryptLetter } from "@/lib/encryption";

export function CreateLetterForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { createLetter, isLoading: contractLoading } = useFutureBaseContract();
  const { uploadToIPFS, isUploading } = useIPFS();

  const [content, setContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [releaseTime, setReleaseTime] = useState("12:00");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const isLoading = contractLoading || isUploading || isEncrypting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message for your letter",
        variant: "destructive",
      });
      return;
    }

    if (!recipientEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!releaseDate) {
      toast({
        title: "Error",
        description: "Please select a release date",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return;
    }

    try {
      // Combine date and time
      const [hours, minutes] = releaseTime.split(":").map(Number);
      const releaseDateTime = new Date(releaseDate);
      releaseDateTime.setHours(hours, minutes, 0, 0);

      const releaseTimestamp = Math.floor(releaseDateTime.getTime() / 1000);

      // Check if release time is in the future
      const now = Math.floor(Date.now() / 1000);
      if (releaseTimestamp <= now + 60) {
        // MIN_RELEASE_OFFSET
        toast({
          title: "Error",
          description: "Release time must be at least 1 minute in the future",
          variant: "destructive",
        });
        return;
      }

      setIsEncrypting(true);

      // Generate encryption key from wallet address
      const key = await generateKeyFromWallet(address);

      // Encrypt the letter with recipient email
      const letterData = {
        content,
        recipientEmail,
      };
      const encryptedData = await encryptLetter(
        JSON.stringify(letterData),
        key
      );

      // Upload encrypted data to IPFS
      const cid = await uploadToIPFS(encryptedData);

      // Create letter on contract
      const txHash = await createLetter(cid, releaseTimestamp);

      toast({
        title: "Success!",
        description: `Letter created successfully! It will be available on ${format(
          releaseDateTime,
          "PPP 'at' p"
        )}`,
      });

      // Reset form
      setContent("");
      setRecipientEmail("");
      setReleaseDate(undefined);
      setReleaseTime("12:00");
    } catch (error) {
      console.error("Error creating letter:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create letter",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipientEmail">Recipient Email</Label>
        <input
          id="recipientEmail"
          type="email"
          placeholder="Enter recipient's email address"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Your Message</Label>
        <Textarea
          id="content"
          placeholder="Write your message to your future self..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Release Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !releaseDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {releaseDate ? format(releaseDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 backdrop-blur-md bg-background/80 border border-primary/20"
              align="start"
            >
              <Calendar
                mode="single"
                selected={releaseDate}
                onSelect={setReleaseDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Release Time</Label>
          <input
            id="time"
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEncrypting
              ? "Encrypting..."
              : isUploading
              ? "Uploading..."
              : "Creating..."}
          </>
        ) : (
          "Send to Future Self"
        )}
      </Button>
    </form>
  );
}
