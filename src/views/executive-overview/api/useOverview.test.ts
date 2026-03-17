import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@shared/lib/test-utils";
import { useOverview } from "./useOverview";
import { apiFetch } from "@shared/api/client";
import { createOverviewResponse } from "@shared/__mocks__/factories";

jest.mock("@shared/api/client");
const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe("useOverview", () => {
  const filters = { time_range: "30d" };

  it("fetches overview data", async () => {
    const mock = createOverviewResponse();
    mockApiFetch.mockResolvedValueOnce(mock);

    const { result } = renderHook(() => useOverview(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mock);
  });

  it("calls apiFetch with correct path and schema", async () => {
    mockApiFetch.mockResolvedValueOnce(createOverviewResponse());

    const { result } = renderHook(
      () => useOverview({ time_range: "7d" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/v1/analytics/overview",
      expect.anything(),
    );
  });

  it("handles API error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Server error"));

    const { result } = renderHook(() => useOverview(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Server error");
  });
});
