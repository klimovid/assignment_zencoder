import { renderHook, waitFor } from "@testing-library/react";
import { useProfile } from "./useProfile";
import { createWrapper } from "@shared/lib/test-utils";

const mockApiFetch = jest.fn();

jest.mock("@shared/api/client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("useProfile", () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
  });

  it("fetches user profile", async () => {
    const mockData = {
      data: {
        id: "u1",
        name: "Test User",
        email: "test@example.com",
        role: "eng_manager",
        org_id: "org-1",
        organization: { id: "org-1", name: "Test Org" },
        teams: [],
        permissions: [],
      },
    };
    mockApiFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/user/profile",
      expect.any(Object),
      expect.objectContaining({ baseUrl: "/api/mock" }),
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("passes errors through", async () => {
    mockApiFetch.mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Unauthorized");
  });
});
