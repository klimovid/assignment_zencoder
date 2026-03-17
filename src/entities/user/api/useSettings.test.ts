import { renderHook, waitFor } from "@testing-library/react";
import { useSettings } from "./useSettings";
import { createWrapper } from "@shared/lib/test-utils";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useSettings", () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
  });

  it("fetches user settings", async () => {
    const mockData = {
      data: {
        user_id: "u1",
        theme: "system",
        timezone: "UTC",
        default_view: "executive-overview",
        default_date_range: "30d",
        email_digest: { frequency: "weekly", scope: "org" },
        language: "en",
        updated_at: "2024-01-01T00:00:00Z",
      },
    };
    mockApiFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/user/settings",
      expect.any(Object),
      expect.objectContaining({ baseUrl: "/api/mock" }),
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("passes errors through", async () => {
    mockApiFetch.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Server error");
  });
});
