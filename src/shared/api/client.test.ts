import { z } from "zod";
import { apiFetch, ApiError } from "./client";

const testSchema = z.object({ id: z.number(), name: z.string() });

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("apiFetch", () => {
  it("fetches and parses valid response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: "test" }),
    });

    const result = await apiFetch("/v1/test", testSchema, {
      baseUrl: "http://localhost:3000/api/mock",
    });
    expect(result).toEqual({ id: 1, name: "test" });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/mock/v1/test",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("throws ApiError on 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: { code: "UNAUTHORIZED", message: "Token expired" } }),
    });

    try {
      await apiFetch("/v1/test", testSchema, { baseUrl: "http://localhost:3000" });
      fail("Should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(401);
      expect((e as ApiError).code).toBe("UNAUTHORIZED");
    }
  });

  it("throws ApiError on 4xx", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({
        error: { code: "NOT_FOUND", message: "Resource not found" },
      }),
    });

    await expect(
      apiFetch("/v1/test", testSchema, { baseUrl: "http://localhost:3000" }),
    ).rejects.toThrow(ApiError);
  });

  it("throws ApiError on 5xx", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    try {
      await apiFetch("/v1/test", testSchema, { baseUrl: "http://localhost:3000" });
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(500);
    }
  });

  it("throws on Zod validation failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "not-a-number", name: 42 }),
    });

    await expect(
      apiFetch("/v1/test", testSchema, { baseUrl: "http://localhost:3000" }),
    ).rejects.toThrow();
  });
});
