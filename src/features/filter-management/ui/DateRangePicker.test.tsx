import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./DateRangePicker";
import { FilterStore } from "../model/FilterStore";
import { FilterStoreProvider } from "../model/FilterContext";

function renderWithStore(store?: FilterStore) {
  const filterStore = store ?? new FilterStore();
  return {
    store: filterStore,
    ...render(
      <FilterStoreProvider store={filterStore}>
        <DateRangePicker />
      </FilterStoreProvider>,
    ),
  };
}

describe("DateRangePicker", () => {
  it("renders preset buttons", () => {
    renderWithStore();
    expect(screen.getByRole("group", { name: "Date range" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "7d" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "30d" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "90d" })).toBeInTheDocument();
  });

  it("defaults to 30d selected", () => {
    renderWithStore();
    expect(screen.getByRole("button", { name: "30d" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "7d" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("clicking preset updates store", async () => {
    const { store } = renderWithStore();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "7d" }));
    expect(store.timeRange).toBe("7d");

    await user.click(screen.getByRole("button", { name: "90d" }));
    expect(store.timeRange).toBe("90d");
  });

  it("reflects external store changes", () => {
    const store = new FilterStore();
    store.setFilter("timeRange", "90d");
    renderWithStore(store);

    expect(screen.getByRole("button", { name: "90d" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
