import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
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

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        org_id: payload.org_id,
        teams: payload.teams,
        permissions: payload.permissions,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid token" } },
      { status: 401 },
    );
  }
}
