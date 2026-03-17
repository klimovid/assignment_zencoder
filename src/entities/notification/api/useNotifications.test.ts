import { renderHook, waitFor } from "@testing-library/react";
import { useNotifications } from "./useNotifications";
import { createWrapper } from "@shared/lib/test-utils";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useNotifications", () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
  });

  it("fetches notifications list", async () => {
    const mockData = {
      data: [],
      pagination: { has_more: false },
      meta: { unread_count: 0, org_id: "org-1", generated_at: "2024-01-01T00:00:00Z" },
    };
    mockApiFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/notifications",
      expect.any(Object),
      expect.objectContaining({ baseUrl: "/api/mock" }),
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("passes errors through", async () => {
    mockApiFetch.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Server error");
  });
});
