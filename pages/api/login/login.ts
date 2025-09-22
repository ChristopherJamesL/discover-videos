import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic-server";
import jwt from "jsonwebtoken";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth?.slice(7);
      console.log("DID TOKEN: ", didToken);

      // invoke magic here
      if (didToken) {
        const metaData = await magicAdmin.users.getMetadataByToken(didToken);
        // console.log("META DATA: ", metaData);
        // invoke jwt
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
              "x-hasura-user-id": `${metaData.issuer}`,
            },
          },
          "the secret goes here"
        );
        console.log("Token: ", token);

        return res.send({ done: true, token });
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
