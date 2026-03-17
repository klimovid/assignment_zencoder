import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-key-must-be-at-least-32-chars-long",
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "No token" } },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const newJwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ ok: true });
    response.cookies.set("auth_token", newJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid token" } },
      { status: 401 },
    );
  }
}
