import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { parseSearchParams, errorResponse, applyDelay } from "../../../../_lib/utils";
import { createSession } from "@shared/__mocks__/factories";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { delayMs, errorCode, searchParams } = parseSearchParams(request);
  await applyDelay(delayMs);
  if (errorCode) return errorResponse(errorCode);

  const { id } = await params;
  const seed = searchParams.get("_seed");
  if (seed) faker.seed(parseInt(seed, 10));

  return NextResponse.json({ data: createSession({ id, status: "completed" }) });
}
