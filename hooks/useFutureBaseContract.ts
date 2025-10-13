import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { readContract, simulateContract } from "wagmi/actions";
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

    console.log(
      "Creating letter with IPFS hash:",
      ipfsHash,
      "and release time:",
      releaseTime
    );

    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "createLetter",
        args: [ipfsHash, BigInt(releaseTime)],
      });
      console.log("Letter creation transaction hash:", hash);
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  const claimLetter = async (letterId: number) => {
    if (!address) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      // Simulate the contract call to get the return value (ipfsHash)
      const { result } = await simulateContract(config, {
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "claimLetter",
        args: [BigInt(letterId)],
        account: address,
      });

      // Execute the transaction
      await writeContractAsync({
        address: FUTURE_BASE_CONTRACT_ADDRESS,
        abi: futureBaseAbi,
        functionName: "claimLetter",
        args: [BigInt(letterId)],
      });

      // Return the IPFS hash from simulation
      return result;
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
        account: address,
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
