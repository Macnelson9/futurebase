export interface EncryptedData {
  iv: string;
  ciphertext: string;
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
  content: string,
  key: CryptoKey
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  return {
    iv: btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
  };
}

export async function decryptLetter(
  encryptedData: EncryptedData,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();

  const iv = new Uint8Array(
    atob(encryptedData.iv)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const ciphertext = new Uint8Array(
    atob(encryptedData.ciphertext)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  return decoder.decode(decrypted);
}
