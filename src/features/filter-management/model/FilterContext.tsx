"use client";

import { createContext, useContext } from "react";
import type { FilterStore } from "./FilterStore";

const FilterStoreContext = createContext<FilterStore | null>(null);

export function FilterStoreProvider({
  store,
  children,
}: {
  store: FilterStore;
  children: React.ReactNode;
}) {
  return (
    <FilterStoreContext.Provider value={store}>
      {children}
    </FilterStoreContext.Provider>
  );
}

export function useFilterStore(): FilterStore {
  const store = useContext(FilterStoreContext);
  if (!store) {
    throw new Error("useFilterStore must be used within FilterStoreProvider");
  }
  return store;
}
