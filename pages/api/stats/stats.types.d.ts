import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  issuer: string;
  publicAddress: string;
  email: string;
  oauthProvider: string | null;
  phoneNumber: string | null;
  username: string | null;
  wallets: string[];
  iat: number;
  exp: number;
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
    "x-hasura-user-id": string;
  };
}
