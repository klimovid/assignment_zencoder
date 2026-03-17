import { render } from "@testing-library/react";
import { FilterStore } from "../model/FilterStore";
import { FilterStoreProvider } from "../model/FilterContext";
import { URLSyncProvider } from "./URLSyncProvider";

const mockReplace = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

function renderWithStore(store: FilterStore, searchParams?: URLSearchParams) {
  if (searchParams) {
    (mockSearchParams as unknown as { _params: URLSearchParams })._params = searchParams;
    // Override getAll and get
    jest.spyOn(mockSearchParams, "get").mockImplementation((key) =>
      searchParams.get(key),
    );
    jest.spyOn(mockSearchParams, "getAll").mockImplementation((key) =>
      searchParams.getAll(key),
    );
  }

  return render(
    <FilterStoreProvider store={store}>
      <URLSyncProvider>
        <div>Content</div>
      </URLSyncProvider>
    </FilterStoreProvider>,
  );
}

describe("URLSyncProvider", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    jest.restoreAllMocks();
  });

  it("reads time_range from URL on mount", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("time_range=7d");
    renderWithStore(store, params);

    expect(store.timeRange).toBe("7d");
  });

  it("reads team_id from URL on mount", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("team_id=alpha&team_id=beta");
    renderWithStore(store, params);

    expect(store.teamIds).toEqual(["alpha", "beta"]);
  });

  it("reads model from URL on mount", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("model=gpt-4");
    renderWithStore(store, params);

    expect(store.model).toBe("gpt-4");
  });

  it("reads comparison from URL on mount", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("comparison=true");
    renderWithStore(store, params);

    expect(store.comparison).toBe(true);
  });

  it("does not read invalid task_type", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("task_type=invalid");
    renderWithStore(store, params);

    expect(store.taskType).toBeNull();
  });

  it("reads valid task_type from URL", () => {
    const store = new FilterStore();
    const params = new URLSearchParams("task_type=bugfix");
    renderWithStore(store, params);

    expect(store.taskType).toBe("bugfix");
  });
});
