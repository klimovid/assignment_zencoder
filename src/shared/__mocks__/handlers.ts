import { http, HttpResponse, delay } from "msw";
import {
  createOverviewResponse,
  createAdoptionResponse,
  createDeliveryResponse,
  createCostResponse,
  createQualityResponse,
  createOperationsResponse,
  createSession,
  createNotificationList,
  createNotification,
  createUserProfile,
  createUserSettings,
} from "./factories";

const BASE = "*/api/mock/v1";

function parseDelayAndError(url: URL) {
  const delayMs = url.searchParams.get("_delay");
  const errorCode = url.searchParams.get("_error");
  return {
    delayMs: delayMs ? parseInt(delayMs, 10) : 0,
    errorCode: errorCode ? parseInt(errorCode, 10) : null,
  };
}

function errorResponse(status: number) {
  const codes: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    500: "INTERNAL_ERROR",
  };
  return HttpResponse.json(
    { error: { code: codes[status] ?? "UNKNOWN", message: `Mock error ${status}` } },
    { status },
  );
}

export const handlers = [
  // --- Analytics ---
  http.get(`${BASE}/analytics/overview`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createOverviewResponse());
  }),

  http.get(`${BASE}/analytics/adoption`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createAdoptionResponse());
  }),

  http.get(`${BASE}/analytics/delivery`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createDeliveryResponse());
  }),

  http.get(`${BASE}/analytics/cost`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createCostResponse());
  }),

  http.get(`${BASE}/analytics/quality`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createQualityResponse());
  }),

  http.get(`${BASE}/analytics/operations`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createOperationsResponse());
  }),

  http.get(`${BASE}/analytics/sessions/:id`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json({ data: createSession({ status: "completed" }) });
  }),

  // --- Notifications ---
  http.get(`${BASE}/analytics/notifications`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createNotificationList());
  }),

  http.patch(`${BASE}/analytics/notifications/:id`, async ({ request }) => {
    const url = new URL(request.url);
    const { errorCode } = parseDelayAndError(url);
    if (errorCode) return errorResponse(errorCode);

    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: {
        id: url.pathname.split("/").pop(),
        read: body.read ?? false,
        acknowledged: body.acknowledged ?? false,
        updated_at: new Date().toISOString(),
      },
    });
  }),

  // --- User ---
  http.get(`${BASE}/user/profile`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createUserProfile());
  }),

  http.patch(`${BASE}/user/profile`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const profile = createUserProfile(body);
    return HttpResponse.json(profile);
  }),

  http.get(`${BASE}/user/settings`, async ({ request }) => {
    const url = new URL(request.url);
    const { delayMs, errorCode } = parseDelayAndError(url);
    if (delayMs) await delay(delayMs);
    if (errorCode) return errorResponse(errorCode);
    return HttpResponse.json(createUserSettings());
  }),

  http.patch(`${BASE}/user/settings`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const settings = createUserSettings(body);
    return HttpResponse.json(settings);
  }),
];
