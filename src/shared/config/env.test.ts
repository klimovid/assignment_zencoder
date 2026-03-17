import { parseClientEnv, parseServerEnv } from "./env";

describe("parseClientEnv", () => {
  it("parses valid client env", () => {
    const result = parseClientEnv({
      NEXT_PUBLIC_ANALYTICS_API_URL: "http://localhost:3000/api/mock",
      NEXT_PUBLIC_API_GATEWAY_URL: "http://localhost:3000/api/mock",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
    expect(result.NEXT_PUBLIC_ANALYTICS_API_URL).toBe(
      "http://localhost:3000/api/mock",
    );
  });

  it("throws on missing required vars", () => {
    expect(() => parseClientEnv({})).toThrow();
  });

  it("throws on invalid URL", () => {
    expect(() =>
      parseClientEnv({
        NEXT_PUBLIC_ANALYTICS_API_URL: "not-a-url",
        NEXT_PUBLIC_API_GATEWAY_URL: "http://localhost:3000",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });

  it("accepts path-only URLs for mock API", () => {
    const result = parseClientEnv({
      NEXT_PUBLIC_ANALYTICS_API_URL: "/api/mock",
      NEXT_PUBLIC_API_GATEWAY_URL: "/api/mock",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
    expect(result.NEXT_PUBLIC_ANALYTICS_API_URL).toBe("/api/mock");
  });
});

describe("parseServerEnv", () => {
  it("parses valid server env", () => {
    const result = parseServerEnv({
      JWT_SECRET: "a-very-long-secret-that-is-at-least-32-chars",
      IDP_CLIENT_ID: "client-id",
      IDP_CLIENT_SECRET: "client-secret",
      IDP_ISSUER_URL: "http://localhost:3000/api/auth",
    });
    expect(result.JWT_SECRET).toBe(
      "a-very-long-secret-that-is-at-least-32-chars",
    );
  });

  it("throws when JWT_SECRET is too short", () => {
    expect(() =>
      parseServerEnv({
        JWT_SECRET: "short",
        IDP_CLIENT_ID: "id",
        IDP_CLIENT_SECRET: "secret",
        IDP_ISSUER_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });

  it("throws on missing vars", () => {
    expect(() => parseServerEnv({})).toThrow();
  });

  it("throws on invalid IDP_ISSUER_URL", () => {
    expect(() =>
      parseServerEnv({
        JWT_SECRET: "a-very-long-secret-that-is-at-least-32-chars",
        IDP_CLIENT_ID: "id",
        IDP_CLIENT_SECRET: "secret",
        IDP_ISSUER_URL: "not-a-url",
      }),
    ).toThrow();
  });
});
