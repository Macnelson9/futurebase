import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export interface UploadLetter {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // Attempting to upload file to Pinata IPFS...

    // Fetch signed URL from your API route
    const urlRequest = await fetch("/api/url");
    const urlResponse = await urlRequest.json();
    if (!urlResponse.url) {
      throw new Error("Failed to get signed URL from /api/url");
    }

    // Upload using the signed URL
    const upload = await pinata.upload.public.file(file).url(urlResponse.url);
    return upload.cid;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    // Do not return a simulated CID here. Throw so caller can handle the failure
    // and avoid storing an invalid/fake CID in the contract.
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error uploading file to IPFS"
    );
  }
};

export const uploadJSONToIPFS = async (jsonData: object): Promise<string> => {
  try {
    // Fetch signed URL from your API route
    const urlRequest = await fetch("/api/url");
    const urlResponse = await urlRequest.json();
    if (!urlResponse.url) {
      throw new Error("Failed to get signed URL from /api/url");
    }

    // Upload using the signed URL
    const upload = await pinata.upload.public
      .json(jsonData)
      .url(urlResponse.url);
    return upload.cid;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error uploading JSON to IPFS"
    );
  }
};

export const getIPFSUrl = (ipfsHash: string): string => {
  const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL;
  return `https://${gateway}/ipfs/${ipfsHash}`;
};

// Fallback to simulation if Pinata is not configured
export const generateSimulatedIpfsCid = (): string => {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const hash = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return `Qm${hash}`;
};
