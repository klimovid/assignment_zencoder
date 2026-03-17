import { renderHook, waitFor, act } from "@testing-library/react";
import { useUpdateSettings } from "./useUpdateSettings";
import { createTestQueryClient } from "@shared/lib/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useUpdateSettings", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    mockApiFetch.mockReset();
    queryClient = createTestQueryClient();
  });

  function wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }

  it("sends PATCH request with settings update", async () => {
    const mockResponse = {
      data: {
        user_id: "u1",
        theme: "dark",
        timezone: "UTC",
        default_view: "executive-overview",
        default_date_range: "30d",
        email_digest: { frequency: "weekly", scope: "org" },
        language: "en",
        updated_at: "2024-01-01T00:00:00Z",
      },
    };
    mockApiFetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateSettings(), { wrapper });

    await act(async () => {
      result.current.mutate({ theme: "dark" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/user/settings",
      expect.any(Object),
      expect.objectContaining({
        method: "PATCH",
        body: { theme: "dark" },
      }),
    );
  });

  it("invalidates settings query on success", async () => {
    const mockResponse = {
      data: {
        user_id: "u1",
        theme: "dark",
        timezone: "UTC",
        default_view: "executive-overview",
        default_date_range: "30d",
        email_digest: { frequency: "weekly", scope: "org" },
        language: "en",
        updated_at: "2024-01-01T00:00:00Z",
      },
    };
    mockApiFetch.mockResolvedValue(mockResponse);

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateSettings(), { wrapper });

    await act(async () => {
      result.current.mutate({ timezone: "America/New_York" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["user", "settings"],
      }),
    );
  });

  it("handles mutation errors", async () => {
    mockApiFetch.mockRejectedValue(new Error("Validation failed"));

    const { result } = renderHook(() => useUpdateSettings(), { wrapper });

    await act(async () => {
      result.current.mutate({ theme: "dark" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Validation failed");
  });
});
