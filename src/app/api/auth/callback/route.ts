import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getDefaultRoute } from "@shared/config/permissions";
import type { Role } from "@shared/config/permissions";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-key-must-be-at-least-32-chars-long",
);

interface MockUser {
  sub: string;
  name: string;
  email: string;
  role: string;
  org_id: string;
  teams: string[];
  permissions: string[];
}

const MOCK_USERS: Record<string, MockUser> = {
  org_admin: {
    sub: "user-001",
    name: "Alice Admin",
    email: "alice@acme.dev",
    role: "org_admin",
    org_id: "org-acme-001",
    teams: ["team-platform", "team-backend", "team-frontend", "team-infra", "team-finance", "team-security"],
    permissions: ["analytics:read", "analytics:write", "settings:read", "settings:write", "cost:read", "quality:read"],
  },
  vp_cto: {
    sub: "user-002",
    name: "Bob CTO",
    email: "bob@acme.dev",
    role: "vp_cto",
    org_id: "org-acme-001",
    teams: ["team-platform", "team-infra"],
    permissions: ["analytics:read", "settings:read"],
  },
  eng_manager: {
    sub: "user-003",
    name: "Carol Manager",
    email: "carol@acme.dev",
    role: "eng_manager",
    org_id: "org-acme-001",
    teams: ["team-backend"],
    permissions: ["analytics:read", "settings:write"],
  },
  platform_eng: {
    sub: "user-004",
    name: "Dave Platform",
    email: "dave@acme.dev",
    role: "platform_eng",
    org_id: "org-acme-001",
    teams: ["team-platform"],
    permissions: ["analytics:read"],
  },
  ic_dev: {
    sub: "user-005",
    name: "Eve Developer",
    email: "eve@acme.dev",
    role: "ic_dev",
    org_id: "org-acme-001",
    teams: ["team-frontend"],
    permissions: ["analytics:read"],
  },
  finops: {
    sub: "user-006",
    name: "Frank FinOps",
    email: "frank@acme.dev",
    role: "finops",
    org_id: "org-acme-001",
    teams: ["team-finance"],
    permissions: ["analytics:read", "cost:read"],
  },
  security: {
    sub: "user-007",
    name: "Grace Security",
    email: "grace@acme.dev",
    role: "security",
    org_id: "org-acme-001",
    teams: ["team-security"],
    permissions: ["analytics:read", "quality:read"],
  },
};

export { MOCK_USERS };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") ?? "eng_manager";

  const user = MOCK_USERS[role] ?? MOCK_USERS.eng_manager!;

  const jwt = await new SignJWT({
    sub: user.sub,
    email: user.email,
    name: user.name,
    role: user.role,
    org_id: user.org_id,
    teams: user.teams,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);

  const defaultRoute = getDefaultRoute(user.role as Role);
  const redirectUrl = new URL(defaultRoute, url.origin);
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
