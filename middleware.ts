import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest, res: NextResponse) {
  console.log("Redirecting to home from mylist");

  const auth = req.cookies.get("token")?.value;

  if (!auth) {
    console.log("INTERCEPTED BIATCH!!!!!!!!");
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: "/browse/my-list",
};
