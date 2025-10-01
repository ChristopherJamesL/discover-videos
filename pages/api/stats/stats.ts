import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "./stats.types";
import { createStats, findVideoIdByUserId, updateStats } from "@/lib/db/hasura";
// import { getTokenFromCookies } from "@/lib/cookie";

const tokenAndVideoCheckAndReturn = (
  res: NextApiResponse,
  token: string,
  videoId: string,
  secret: string
): MyJwtPayload | void => {
  if (!token) return res.status(401).json({ msg: "Failed, Missing JWT Token" });
  if (!videoId)
    return res.status(400).json({ msg: "Failed, Missing video id" });

  return jwt.verify(token, secret) as MyJwtPayload;
};

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token ? req.cookies.token : "";
  // const token = getTokenFromCookies(req);
  const secret = process.env.HASURA_GRAPHQL_JWT_SECRET_KEY ?? "";
  const { favorited, watched = true } = req.body;
  const inputParams = req.method === "POST" ? req.body : req.query;
  const { videoId } = inputParams;
  console.log({
    token,
    secret,
    favorited,
    watched,
    videoId,
  });

  const decodedToken = tokenAndVideoCheckAndReturn(res, token, videoId, secret);
  console.log("Decoded Token: ", decodedToken);
  if (!decodedToken) return;
  const { issuer } = decodedToken;

  if (req.method === "POST") {
    try {
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
  } else {
    try {
      const findVideoId =
        (await findVideoIdByUserId(token, issuer, videoId)) ?? [];

      if (findVideoId.length > 0) {
        console.log("Find video Id: ", findVideoId);
        return res.status(200).json({ msg: "Video Found", findVideoId });
      } else {
        return res.status(400).json({ stat: null, msg: "video Id not found" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Error getting stats data", error: e });
    }
  }
}
