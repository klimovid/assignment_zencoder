import { NextResponse } from "next/server";
import { parseSearchParams, errorResponse } from "../../../../_lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { errorCode } = parseSearchParams(request);
  if (errorCode) return errorResponse(errorCode);

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  return NextResponse.json({
    data: {
      id,
      read: body.read ?? false,
      acknowledged: body.acknowledged ?? false,
      updated_at: new Date().toISOString(),
    },
  });
}
