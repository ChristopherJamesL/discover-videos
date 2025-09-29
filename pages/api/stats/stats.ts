import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "./stats.types";
import { findVideoIdByUserId } from "@/lib/db/hasura";

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const auth = req.headers?.authorization;
    const token = req.cookies.token ? req.cookies.token : "";
    const secret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? "";
    const videoId = Array.isArray(req.query.videoId)
      ? (req.query.videoId[0] ?? "")
      : (req.query.videoId ?? "");

    if (auth?.slice(0, 6) === "Bearer") {
      try {
        if (!token) res.status(403).json({ msg: "No JWT Token detected" });

        const decoded = jwt.verify(token, secret) as MyJwtPayload;
        const { issuer } = decoded;
        console.log("Decoded: ", decoded);

        const findVideoId =
          (await findVideoIdByUserId(token, issuer, videoId)) ?? [];
        console.log("Find Video Id: ", findVideoId);

        if (findVideoId.length === 0) {
          // create stats
          // const response = await createStats(token, issuer, videoId);
          // res.status(200).json({ msg: "Stat Created: ", response });
        } else {
          // update stats
          // const response = await updateStats(token, issuer, videoId);
          // res.status(200).json({ msg: "Stat Updated: ", response });
        }
        res.status(200).send({ msg: "It Works!", decoded });
      } catch (e) {
        res.status(500).json({ msg: "It doesn't work!", error: e });
      }
    } else {
      res.status(401).send({ msg: "auth not of type bearer" });
    }
  }
}
