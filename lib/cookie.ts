import type { NextApiResponse } from "next";
import * as cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;
const isSecure = process.env.NODE_ENV === "production";

export const setTokenCookie = (token: string) => {
  return cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: isSecure,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
};

export const parseCookies = (req: { headers: { cookie?: string } }) => {
  return cookie.parse(req.headers.cookie || "");
};

export const getTokenFromCookies = (req: { headers: { cookie?: string } }) => {
  const cookies = parseCookies(req);
  return cookies.token || "";
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
  });

  res.setHeader("Set-Cookie", val);
};
