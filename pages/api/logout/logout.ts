import { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic-server";
import { removeTokenCookie } from "@/lib/cookie";
import { verifyJWT } from "@/lib/utils";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.cookies.token) {
      console.log("No token");

      return res.status(401).json({ msg: "User Not Logged In" });
    }

    const token = req.cookies.token;
    const verified = await verifyJWT(token);
    if (!verified || !verified.issuer) {
      console.log("No verified");

      return res.status(401).json({ msg: "Invalid Token or ID" });
    }
    const userId = verified.issuer;

    removeTokenCookie(res);

    try {
      await magicAdmin.users.logoutByIssuer(userId);
    } catch (e) {
      console.log("Error Logging Out User", e);
    }

    return res.status(200).json({ msg: "Successfully Logged Out" });
  } catch (e) {
    return res.status(500).json({ msg: "Something Went Wrong", e });
  }
}
