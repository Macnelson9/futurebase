// Import multiformats CID as any to avoid TypeScript resolution problems
// @ts-ignore
const mf: any = require("multiformats/cid");
const CID = mf && (mf.CID || mf.default || mf);

// Convert CIDv0 (Qm...) to CIDv1 (base32) string. Returns null if conversion fails.
export function cidV0ToV1(cidStr: string): string | null {
  try {
    if (!CID) return null;
    const cid = CID.parse(cidStr);
    if (cid.version === 1) return cid.toString();
    return cid.toV1().toString();
  } catch (e) {
    // don't spam the console for expected failures
    return null;
  }
}
