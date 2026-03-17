import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@shared/lib/test-utils";
import { useDelivery } from "./useDelivery";
import { apiFetch } from "@shared/api/client";
import { createDeliveryResponse } from "@shared/__mocks__/factories";

jest.mock("@shared/api/client");
const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe("useDelivery", () => {
  it("fetches delivery data", async () => {
    const mock = createDeliveryResponse();
    mockApiFetch.mockResolvedValueOnce(mock);

    const { result } = renderHook(() => useDelivery({ time_range: "30d" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mock);
  });

  it("handles error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Fail"));

    const { result } = renderHook(() => useDelivery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
