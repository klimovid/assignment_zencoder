import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { parseSearchParams, errorResponse, applyDelay } from "../../../_lib/utils";
import { createOverviewResponse } from "@shared/__mocks__/factories";

export async function GET(request: Request) {
  const { delayMs, errorCode, searchParams } = parseSearchParams(request);
  await applyDelay(delayMs);
  if (errorCode) return errorResponse(errorCode);

  const seed = searchParams.get("_seed");
  if (seed) faker.seed(parseInt(seed, 10));

  return NextResponse.json(createOverviewResponse());
}
