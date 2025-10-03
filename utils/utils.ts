import { MyJwtPayload } from "@/pages/api/stats/stats.types";
import jwt from "jsonwebtoken";

export function verifyJWT(token: string): MyJwtPayload | void {
  const secret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? "";
  return jwt.verify(token, secret) as MyJwtPayload;
}
