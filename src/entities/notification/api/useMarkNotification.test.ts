import { renderHook, waitFor, act } from "@testing-library/react";
import { useMarkNotification } from "./useMarkNotification";
import { createTestQueryClient } from "@shared/lib/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useMarkNotification", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    mockApiFetch.mockReset();
    queryClient = createTestQueryClient();
  });

  function wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }

  it("sends PATCH request with read flag", async () => {
    const mockResponse = {
      data: { id: "n1", read: true, acknowledged: false, updated_at: "2024-01-01T00:00:00Z" },
    };
    mockApiFetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMarkNotification(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: "n1", read: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/notifications/n1",
      expect.any(Object),
      expect.objectContaining({
        method: "PATCH",
        body: { read: true },
      }),
    );
  });

  it("invalidates notifications query on success", async () => {
    const mockResponse = {
      data: { id: "n1", read: true, acknowledged: false, updated_at: "2024-01-01T00:00:00Z" },
    };
    mockApiFetch.mockResolvedValue(mockResponse);

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkNotification(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: "n1", read: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["notifications"],
      }),
    );
  });

  it("handles mutation errors", async () => {
    mockApiFetch.mockRejectedValue(new Error("Forbidden"));

    const { result } = renderHook(() => useMarkNotification(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: "n1", read: true });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Forbidden");
  });
});
