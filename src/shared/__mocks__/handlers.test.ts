/**
 * @jest-environment node
 */
import { faker } from "@faker-js/faker";
import { OverviewResponseSchema } from "@pages/executive-overview/api/schemas";
import { AdoptionResponseSchema } from "@pages/adoption/api/schemas";
import { DeliveryResponseSchema } from "@pages/delivery/api/schemas";
import { CostResponseSchema } from "@pages/cost/api/schemas";
import { QualityResponseSchema } from "@pages/quality/api/schemas";
import { OperationsResponseSchema } from "@pages/operations/api/schemas";
import { SessionSchema } from "@entities/session/model/types";
import { NotificationListResponseSchema, NotificationPatchResponseSchema } from "@entities/notification/model/types";
import { UserProfileSchema, UserSettingsSchema } from "@entities/user/model/types";
import { server } from "./setup";

const BASE = "http://localhost:3000/api/mock/v1";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => faker.seed(42));

describe("MSW handlers", () => {
  it("GET /analytics/overview returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/overview`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(() => OverviewResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/adoption returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/adoption`);
    const data = await res.json();
    expect(() => AdoptionResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/delivery returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/delivery`);
    const data = await res.json();
    expect(() => DeliveryResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/cost returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/cost`);
    const data = await res.json();
    expect(() => CostResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/quality returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/quality`);
    const data = await res.json();
    expect(() => QualityResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/operations returns valid response", async () => {
    const res = await fetch(`${BASE}/analytics/operations`);
    const data = await res.json();
    expect(() => OperationsResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /analytics/sessions/:id returns valid session", async () => {
    const res = await fetch(`${BASE}/analytics/sessions/test-session-1`);
    const json = await res.json();
    expect(() => SessionSchema.parse(json.data)).not.toThrow();
  });

  it("GET /analytics/notifications returns valid list", async () => {
    const res = await fetch(`${BASE}/analytics/notifications`);
    const data = await res.json();
    expect(() => NotificationListResponseSchema.parse(data)).not.toThrow();
  });

  it("PATCH /analytics/notifications/:id returns valid patch response", async () => {
    const res = await fetch(`${BASE}/analytics/notifications/notif-1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    const data = await res.json();
    expect(() => NotificationPatchResponseSchema.parse(data)).not.toThrow();
  });

  it("GET /user/profile returns valid response", async () => {
    const res = await fetch(`${BASE}/user/profile`);
    const data = await res.json();
    expect(() => UserProfileSchema.parse(data)).not.toThrow();
  });

  it("GET /user/settings returns valid response", async () => {
    const res = await fetch(`${BASE}/user/settings`);
    const data = await res.json();
    expect(() => UserSettingsSchema.parse(data)).not.toThrow();
  });

  it("_error param returns error response", async () => {
    const res = await fetch(`${BASE}/analytics/overview?_error=500`);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });

  it("_error=401 returns unauthorized", async () => {
    const res = await fetch(`${BASE}/analytics/overview?_error=401`);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error.code).toBe("UNAUTHORIZED");
  });
});
