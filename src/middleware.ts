import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route protection
const protectedRoutes = ["/dashboard", "/onboarding"];
const publicRoutes = ["/login", "/signup", "/"];

// Function to extract the subdomain from the request
function getValidSubdomain(host: string | null): string | null {
  if (!host) return null;

  const subdomain = host.split(".")[0];

  if (subdomain && subdomain !== "www" && subdomain !== "easystore" && !subdomain.includes("localhost")) {
    return subdomain;
  }
  return null;
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  console.log("path:", path);

  const host = req.headers.get("host");
  const subdomain = getValidSubdomain(host);

  // Authentication check
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Handle subdomain-based routing
  if (subdomain) {
    console.log(`>>> Rewriting: ${path} to /${subdomain}${path}`);
    url.pathname = `/${subdomain}${path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}


// ✅ Fixed matcher configuration
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

