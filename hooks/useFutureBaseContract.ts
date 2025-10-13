import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/wagmi";
import {
  futureBaseAbi,
  FUTURE_BASE_CONTRACT_ADDRESS,
} from "@/lib/futureBaseAbi";

export function useFutureBaseContract() {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const createLetter = async (ipfsHash: string, releaseTime: number) => {
    if (!address) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "createLetter",
        args: [ipfsHash, BigInt(releaseTime)],
      });
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  const claimLetter = async (letterId: number) => {
    if (!address) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "claimLetter",
        args: [BigInt(letterId)],
      });
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  const { data: userLetters, refetch: refetchUserLetters } = useReadContract({
    address: FUTURE_BASE_CONTRACT_ADDRESS,
    abi: futureBaseAbi,
    functionName: "getUserLetter",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const getLetterDetails = async (letterId: number) => {
    try {
      const result = await readContract(config, {
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "getLetter",
        args: [BigInt(letterId)],
      });
      return result;
    } catch (error) {
      console.error("Error reading letter details:", error);
      throw error;
    }
  };

  return {
    createLetter,
    claimLetter,
    userLetters: userLetters as bigint[] | undefined,
    getLetterDetails,
    refetchUserLetters,
    isLoading,
  };
}
