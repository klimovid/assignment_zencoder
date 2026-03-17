"use client";

import { createContext, useContext } from "react";
import type { RootStore } from "./stores";

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({
  store,
  children,
}: {
  store: RootStore;
  children: React.ReactNode;
}) {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
}

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return store;
}
