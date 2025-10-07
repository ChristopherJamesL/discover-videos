import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "./lib/utils";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // check the token

  const token = req.cookies.get("token")?.value;
  const verifiedToken = token && (await verifyJWT(token));
  // if token is valid
  if (verifiedToken) return NextResponse.next();
  // || if page is /login
  if (!verifiedToken) {
    console.log("INTERCEPTED BIATCH!!!!!!!!");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // if no token
}

export const config = {
  matcher: "/browse/my-list",
};
