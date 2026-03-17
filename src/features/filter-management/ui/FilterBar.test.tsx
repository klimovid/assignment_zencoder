import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import { FilterStore } from "../model/FilterStore";
import { FilterStoreProvider } from "../model/FilterContext";

function renderWithStore(store?: FilterStore) {
  const filterStore = store ?? new FilterStore();
  return {
    store: filterStore,
    ...render(
      <FilterStoreProvider store={filterStore}>
        <FilterBar />
      </FilterStoreProvider>,
    ),
  };
}

describe("FilterBar", () => {
  it("renders nothing when no active filters", () => {
    const { container } = renderWithStore();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders team filter chips", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["alpha", "beta"]);
    renderWithStore(store);

    expect(screen.getByText("Team: alpha")).toBeInTheDocument();
    expect(screen.getByText("Team: beta")).toBeInTheDocument();
  });

  it("renders model filter chip", () => {
    const store = new FilterStore();
    store.setFilter("model", "claude-3");
    renderWithStore(store);

    expect(screen.getByText("Model: claude-3")).toBeInTheDocument();
  });

  it("renders task type filter chip", () => {
    const store = new FilterStore();
    store.setFilter("taskType", "bugfix");
    renderWithStore(store);

    expect(screen.getByText("Type: bugfix")).toBeInTheDocument();
  });

  it("removes a chip on click", async () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["alpha", "beta"]);
    renderWithStore(store);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Remove Team: alpha" }));

    expect(store.teamIds).toEqual(["beta"]);
  });

  it("clears all filters", async () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["alpha"]);
    store.setFilter("model", "gpt-4");
    renderWithStore(store);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(store.hasActiveFilters).toBe(false);
  });

  it("renders chips for multiple filter types (AND composition)", () => {
    const store = new FilterStore();
    store.setFilter("teamIds", ["alpha"]);
    store.setFilter("model", "gpt-4");
    store.setFilter("language", "typescript");
    renderWithStore(store);

    expect(screen.getByText("Team: alpha")).toBeInTheDocument();
    expect(screen.getByText("Model: gpt-4")).toBeInTheDocument();
    expect(screen.getByText("Lang: typescript")).toBeInTheDocument();
  });
});
