import { NextResponse } from "next/server";

export function parseSearchParams(request: Request) {
  const url = new URL(request.url);
  const delayMs = url.searchParams.get("_delay");
  const errorCode = url.searchParams.get("_error");
  return {
    url,
    delayMs: delayMs ? parseInt(delayMs, 10) : 0,
    errorCode: errorCode ? parseInt(errorCode, 10) : null,
    searchParams: url.searchParams,
  };
}

export function errorResponse(status: number) {
  const codes: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
    500: "INTERNAL_ERROR",
  };
  return NextResponse.json(
    { error: { code: codes[status] ?? "UNKNOWN", message: `Mock error ${status}` } },
    { status },
  );
}

export async function applyDelay(delayMs: number) {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, 5000)));
  }
}
