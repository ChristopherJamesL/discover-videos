import { MyJwtPayload } from "@/pages/api/stats/stats.types";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? ""
);

export async function verifyJWT(
  token: string
): Promise<MyJwtPayload | undefined> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as MyJwtPayload;
  } catch (e) {
    console.error("JWT verification failed", e);
    return undefined;
  }
}
