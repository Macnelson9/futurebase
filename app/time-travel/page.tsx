"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ConnectWalletButton } from "@/components/connect-wallet";
import { CreateLetterForm } from "@/components/create-letter-form";
import { UserLetters } from "@/components/user-letters";

export default function TimeTravelPage() {
  const { isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Connect your wallet to send encrypted letters to your future self
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 mt-40">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Time Travel to your Memories
          </h1>
          <p className="text-lg text-muted-foreground">
            Send encrypted memories to your future self on the blockchain
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Create Letter Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Create a New Memory
                </CardTitle>
                <CardDescription>
                  Write a message that will be encrypted and stored until your
                  chosen date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateLetterForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
              </CardContent>
            </Card>
          </div>

          {/* View Letters Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Your Time Travel Memories
                </CardTitle>
                <CardDescription>
                  View and reveal your memories when they become available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserLetters key={refreshKey} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
