import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "./stats.types";
import { createStats, findVideoIdByUserId, updateStats } from "@/lib/db/hasura";

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const token = req.cookies.token ? req.cookies.token : "";
    const secret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? "";
    const { favorited, watched = true, videoId } = req.body;

    try {
      if (!token)
        return res.status(403).json({ msg: "Failed, Missing JWT Token" });
      if (!videoId)
        return res.status(400).json({ msg: "Failed, Missing video id" });

      const decoded = jwt.verify(token, secret) as MyJwtPayload;
      const { issuer } = decoded;
      console.log("Decoded: ", decoded);

      const findVideoId =
        (await findVideoIdByUserId(token, issuer, videoId)) ?? [];
      console.log("Find Video Id: ", findVideoId);

      if (findVideoId.length === 0) {
        const response = await createStats(
          token,
          issuer,
          videoId,
          favorited,
          watched
        );
        return res.status(200).json(response);
      } else {
        const response = await updateStats(
          token,
          issuer,
          videoId,
          favorited,
          watched
        );
        return res.status(200).json(response);
      }
    } catch (e) {
      res
        .status(500)
        .json({ msg: "Error creating or updating data", error: e });
    }
  }
}
