import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic-server";
import jwt from "jsonwebtoken";
import { isNewUser } from "@/lib/db/hasura";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const jwtSecret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY;
  if (!jwtSecret)
    throw new Error("Missing HASURA_GRAPHQL_JWT_SECRET_KEY in env variables");

  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth?.slice(7);

      if (didToken) {
        const metaData = await magicAdmin.users.getMetadataByToken(didToken);
        const { issuer } = metaData;
        if (!issuer) throw new Error("Missing issuer");

        const token = jwt.sign(
          {
            // "sub": "1234567890",
            // "name": "Anky",
            ...metaData,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
            "https://hasura.io/jwt/claims": {
              "x-hasura-default-role": "user",
              "x-hasura-allowed-roles": ["user", "admin"],
              "x-hasura-user-id": `${issuer}`,
            },
          },
          jwtSecret
        );
        console.log("Token: ", token);
        // Check if user exists
        const isNewUserQuery = await isNewUser(token, issuer);

        return res.send({ done: true, token, isNewUserQuery });
      }
      return res.status(401).json({ done: false, error: "Missing token" });
    } catch (e) {
      console.error("Something went wrong loggin in", e);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
