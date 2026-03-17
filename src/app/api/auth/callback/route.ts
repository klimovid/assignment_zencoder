import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-key-must-be-at-least-32-chars-long",
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") ?? "eng_manager";

  const jwt = await new SignJWT({
    sub: "user-mock-001",
    email: "dev@example.com",
    name: "Mock Developer",
    role,
    org_id: "org-mock-001",
    teams: ["team-platform", "team-backend"],
    permissions: ["analytics:read", "settings:write"],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);

  const redirectUrl = new URL("/dashboard", url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("auth_token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return response;
}
