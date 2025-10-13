import { useState } from "react";
import { uploadJSONToIPFS, getIPFSUrl } from "@/services/ipfsService";

export function useIPFS() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToIPFS = async (data: object) => {
    setIsUploading(true);
    try {
      const cid = await uploadJSONToIPFS(data);
      return cid;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchFromIPFS = async (hash: string) => {
    try {
      if (!hash || hash.trim() === "") {
        throw new Error("IPFS hash is empty or undefined");
      }
      const url = getIPFSUrl(hash);
      console.log("Fetching from IPFS URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching from IPFS:", error);
      throw error;
    }
  };

  return {
    uploadToIPFS,
    fetchFromIPFS,
    isUploading,
  };
}
