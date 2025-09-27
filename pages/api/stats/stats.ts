import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const auth = req.headers?.authorization;
    const token = req.cookies.token ? req.cookies.token : "";
    const secret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? "";

    if (auth?.slice(0, 6) === "Bearer") {
      try {
        if (!token) res.status(403).json({ msg: "No JWT Token detected" });

        const decoded = jwt.verify(token, secret);
        console.log("Decoded: ", decoded);

        res.status(200).send({ msg: "It Works!", decoded });
      } catch (e) {
        res.status(500).json({ msg: "It doesn't work!", error: e });
      }
    } else {
      res.status(401).send({ msg: "auth not of type bearer" });
    }
  }
}
