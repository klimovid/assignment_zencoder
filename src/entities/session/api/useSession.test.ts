import { renderHook, waitFor } from "@testing-library/react";
import { useSession } from "./useSession";
import { createWrapper } from "@shared/lib/test-utils";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useSession", () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
  });

  it("is disabled when sessionId is undefined", () => {
    const { result } = renderHook(() => useSession(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("fetches session when sessionId is provided", async () => {
    const mockData = { data: { id: "sess-1" } };
    mockApiFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useSession("sess-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/analytics/sessions/sess-1",
      expect.any(Object),
      expect.objectContaining({
        baseUrl: "/api/mock",
      }),
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("passes errors through", async () => {
    mockApiFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSession("sess-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network error");
  });
});
