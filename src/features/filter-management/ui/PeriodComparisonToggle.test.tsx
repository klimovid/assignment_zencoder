import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeriodComparisonToggle } from "./PeriodComparisonToggle";
import { FilterStore } from "../model/FilterStore";
import { FilterStoreProvider } from "../model/FilterContext";

function renderWithStore(store?: FilterStore) {
  const filterStore = store ?? new FilterStore();
  return {
    store: filterStore,
    ...render(
      <FilterStoreProvider store={filterStore}>
        <PeriodComparisonToggle />
      </FilterStoreProvider>,
    ),
  };
}

describe("PeriodComparisonToggle", () => {
  it("renders as not pressed by default", () => {
    renderWithStore();
    const btn = screen.getByRole("button", {
      name: "Compare with previous period",
    });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles comparison on click", async () => {
    const { store } = renderWithStore();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Compare with previous period" }),
    );
    expect(store.comparison).toBe(true);

    await user.click(
      screen.getByRole("button", { name: "Compare with previous period" }),
    );
    expect(store.comparison).toBe(false);
  });

  it("reflects external store changes", () => {
    const store = new FilterStore();
    store.setFilter("comparison", true);
    renderWithStore(store);

    expect(
      screen.getByRole("button", { name: "Compare with previous period" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
