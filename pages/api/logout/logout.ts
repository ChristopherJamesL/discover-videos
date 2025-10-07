import { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic-server";
import { removeTokenCookie } from "@/lib/cookie";
import { verifyJWT } from "@/lib/utils";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token");
      return res.status(401).json({ msg: "User Not Logged In" });
    }

    const verified = await verifyJWT(token);

    if (!verified || !verified.issuer) {
      console.log("Token not verified");
      return res.status(401).json("Invalid Token or ID");
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
    console.log(" Logout Error: ", e);
    return res.status(500).json({ msg: "Something Went Wrong", e });
  }
}
