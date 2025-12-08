import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import ROUTES from "./constants/routes";

const protectedRoutes = ["/ask-question" , "/questions/:id*/edit"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedRoutes.some((path) => pathname.startsWith(path)))
    return NextResponse.next();

  const session = await auth();
  if (!session?.user?.id) {
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
