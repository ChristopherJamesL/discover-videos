import * as cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token: string) => {
  return cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
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
