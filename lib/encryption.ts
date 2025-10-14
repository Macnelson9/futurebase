export interface EncryptedData {
  iv: string;
  ciphertext: string;
  isBinary?: boolean;
}

// Generate encryption key from wallet address using PBKDF2
export async function generateKeyFromWallet(
  walletAddress: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(walletAddress),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const salt = encoder.encode("futurebase-salt"); // Fixed salt for deterministic key

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptLetter(
  content: string | ArrayBuffer,
  key: CryptoKey
): Promise<EncryptedData> {
  const isBinary = content instanceof ArrayBuffer;
  const data = isBinary
    ? new Uint8Array(content as ArrayBuffer)
    : new TextEncoder().encode(content as string);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    data.buffer as ArrayBuffer
  );

  const ciphertextBytes = new Uint8Array(ciphertextBuffer);

  return {
    iv: uint8ArrayToBase64(iv),
    ciphertext: uint8ArrayToBase64(ciphertextBytes),
    isBinary,
  };
}

export async function decryptLetter(
  encryptedData: EncryptedData,
  key: CryptoKey
): Promise<string | ArrayBuffer> {
  const iv = base64ToUint8Array(encryptedData.iv);
  const ciphertext = base64ToUint8Array(encryptedData.ciphertext);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer,
    },
    key,
    ciphertext.buffer as ArrayBuffer
  );

  if (encryptedData.isBinary) {
    return decrypted;
  } else {
    return new TextDecoder().decode(decrypted);
  }
}

// Helper: convert Uint8Array -> base64 safely in chunks to avoid large argument lists
function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000; // 32KB chunks
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    // Convert chunk to string
    let chunkStr = "";
    for (let j = 0; j < chunk.length; j++) {
      chunkStr += String.fromCharCode(chunk[j]);
    }
    binary += chunkStr;
  }
  return btoa(binary);
}

// Helper: convert base64 -> Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
