import { Magic } from "magic-sdk";

let magic: Magic | null = null;

export const getMagic = (): Magic => {
  if (typeof window === "undefined")
    throw new Error("Magic SDK is only available client side");
  if (!magic) {
    const apiKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY;
    if (!apiKey) throw new Error("No Magic Publishable API key provided");
    magic = new Magic(apiKey);
  }
  return magic;
};
