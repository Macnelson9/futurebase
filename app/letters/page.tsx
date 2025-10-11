"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Letter {
  id: string;
  unlockTime: number;
  status: "locked" | "unlocked";
  content?: string;
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);

  useEffect(() => {
    // TODO: Fetch letters from contract
    // Mock data for now
    setLetters([
      { id: "1", unlockTime: Date.now() + 86400000, status: "locked" },
      {
        id: "2",
        unlockTime: Date.now() - 86400000,
        status: "unlocked",
        content: "Hello future me!",
      },
    ]);
  }, []);

  const handleDecrypt = (letterId: string) => {
    // TODO: Decrypt and display letter
    console.log("Decrypting letter:", letterId);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Letters</h1>
      <div className="grid gap-4">
        {letters.map((letter) => (
          <Card key={letter.id}>
            <CardHeader>
              <CardTitle>Letter #{letter.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Unlock Time: {new Date(letter.unlockTime).toLocaleDateString()}
              </p>
              <p>Status: {letter.status}</p>
              {letter.status === "unlocked" && letter.content && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <p>{letter.content}</p>
                </div>
              )}
              {letter.status === "unlocked" && !letter.content && (
                <Button
                  onClick={() => handleDecrypt(letter.id)}
                  className="mt-4"
                >
                  Decrypt Letter
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
