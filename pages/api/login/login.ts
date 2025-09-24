import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic-server";
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "@/lib/db/hasura";
import { setTokenCookie } from "@/lib/cookie";

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
        if (!issuer || !metaData) throw new Error("Missing issuer or metaData");

        const token = jwt.sign(
          {
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

        const isNewUserQuery = await isNewUser(token, issuer);
        if (isNewUserQuery) await createNewUser(token, metaData);

        const tokenCookie = setTokenCookie(token);
        console.log("Token Cookie: ", tokenCookie);

        res.setHeader("Set-Cookie", tokenCookie);
        return res.send({ done: true });
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
