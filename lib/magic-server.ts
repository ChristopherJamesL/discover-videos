import { Magic } from "@magic-sdk/admin";

export const magicAdmin = await Magic.init(process.env.MAGIC_SECRET_API_KEY);
