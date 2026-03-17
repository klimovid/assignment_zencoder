import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@shared/lib/test-utils";
import { useAdoption } from "./useAdoption";
import { apiFetch } from "@shared/api/client";
import { createAdoptionResponse } from "@shared/__mocks__/factories";

jest.mock("@shared/api/client");
const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe("useAdoption", () => {
  it("fetches adoption data", async () => {
    const mock = createAdoptionResponse();
    mockApiFetch.mockResolvedValueOnce(mock);

    const { result } = renderHook(() => useAdoption({ time_range: "30d" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mock);
  });

  it("handles error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useAdoption({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
