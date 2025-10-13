"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X } from "lucide-react";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="uppercase font-mono text-primary text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          onClick={() => disconnect()}
          size="sm"
          className="uppercase font-mono"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger asChild>
        <Button className="uppercase font-mono">Connect Wallet</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background border border-primary/20 rounded-lg p-6 w-full max-w-md z-50">
          <Dialog.Title className="text-xl font-mono uppercase text-center mb-6">
            Connect Wallet
          </Dialog.Title>

          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => {
                  connect({ connector, chainId: baseSepolia.id });
                  setIsModalOpen(false);
                }}
                disabled={isPending}
                className="w-full uppercase font-mono justify-start"
                size="sm"
              >
                {isPending ? "Connecting..." : `Connect ${connector.name}`}
              </Button>
            ))}
            <div className="text-xs text-center text-muted-foreground mt-4">
              Will connect to Base Sepolia testnet
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
