import CryptoJS from "crypto-js";

// Generate a key from wallet address (simplified)
export function generateKeyFromWallet(walletAddress: string): string {
  return CryptoJS.SHA256(walletAddress).toString();
}

export function encryptLetter(content: string, key: string): string {
  return CryptoJS.AES.encrypt(content, key).toString();
}

export function decryptLetter(encryptedContent: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
