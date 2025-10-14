import { useState } from "react";
import {
  uploadJSONToIPFS as serviceUploadJSONToIPFS,
  uploadToIPFS as serviceUploadToIPFS,
  getIPFSUrl,
} from "@/services/ipfsService";
import { cidV0ToV1 } from "@/lib/cid";

export function useIPFS() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToIPFS = async (data: object | File): Promise<string> => {
    setIsUploading(true);
    try {
      if (data instanceof File) {
        const cid = await serviceUploadToIPFS(data);
        return cid;
      } else {
        const cid = await serviceUploadJSONToIPFS(data);
        return cid;
      }
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
      const response = await fetch(url);
      if (!response.ok) {
        // try to read response body for more context
        let body = "";
        try {
          body = await response.text();
        } catch (e) {
          body = "<unable to read response body>";
        }
        const message = `Failed to fetch from IPFS: ${response.status} ${response.statusText} - ${body} (url: ${url})`;

        // If the CID looks like a CIDv0 (starts with Qm) try converting to CIDv1 and retry once
        if (hash.startsWith("Qm")) {
          try {
            // Dynamically import multiformats to avoid build-time type issues
            // @ts-ignore - multiformats exports don't align with TS 'exports' resolution here
            const mf: any = await import("multiformats/cid");
            const CID = mf && (mf.CID || mf.default || mf);
            if (CID) {
              try {
                const cid = CID.parse(hash);
                const v1 = cid.toV1().toString();
                const retryUrl = getIPFSUrl(v1);
                const retryResp = await fetch(retryUrl);
                if (retryResp.ok) {
                  const contentType2 =
                    retryResp.headers.get("content-type") || "";
                  if (
                    contentType2.includes("application/json") ||
                    contentType2.includes("text/")
                  ) {
                    return await retryResp.json();
                  }
                  const buffer2 = await retryResp.arrayBuffer();
                  try {
                    const text2 = new TextDecoder().decode(buffer2);
                    return JSON.parse(text2);
                  } catch (err) {
                    return buffer2;
                  }
                }
              } catch (e) {
                // ignore conversion errors and fall through to throw the original message
              }
            }
          } catch (e) {
            // ignore dynamic import errors and fall through
          }
        }

        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") || "";
      // If JSON, return parsed JSON
      if (
        contentType.includes("application/json") ||
        contentType.includes("text/")
      ) {
        return await response.json();
      }

      // For non-JSON responses, attempt to parse as JSON text first, else return ArrayBuffer
      const buffer = await response.arrayBuffer();
      try {
        const text = new TextDecoder().decode(buffer);
        return JSON.parse(text);
      } catch (err) {
        // not JSON, return raw ArrayBuffer
        return buffer;
      }
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
