import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const verifiedToken = token && (await verifyJWT(token));

  if (verifiedToken) return NextResponse.next();
  if (!verifiedToken) {
    console.log("No Verified Token");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: "/browse/my-list",
};
