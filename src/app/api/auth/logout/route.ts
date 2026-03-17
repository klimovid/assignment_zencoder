import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUrl = new URL("/", url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete("auth_token");
  return response;
}

export async function POST(request: Request) {
  return GET(request);
}
