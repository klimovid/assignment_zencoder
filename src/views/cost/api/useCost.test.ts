import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@shared/lib/test-utils";
import { useCost } from "./useCost";
import { apiFetch } from "@shared/api/client";
import { createCostResponse } from "@shared/__mocks__/factories";

jest.mock("@shared/api/client");
const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe("useCost", () => {
  it("fetches cost data", async () => {
    const mock = createCostResponse();
    mockApiFetch.mockResolvedValueOnce(mock);

    const { result } = renderHook(() => useCost({ time_range: "30d" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mock);
  });

  it("handles error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Fail"));

    const { result } = renderHook(() => useCost({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
