"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WritePage() {
  const [letter, setLetter] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  const handleSubmit = () => {
    // TODO: Implement encryption, IPFS upload, contract call
    console.log("Submitting letter:", letter, unlockDate);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Write a Letter to Your Future Self</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Letter
            </label>
            <Textarea
              placeholder="Write your message..."
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Unlock Date
            </label>
            <input
              type="datetime-local"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Encrypt & Send Letter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
