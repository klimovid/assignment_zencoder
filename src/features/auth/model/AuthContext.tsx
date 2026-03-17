"use client";

import { createContext, useContext } from "react";
import type { AuthStore } from "./AuthStore";

const AuthStoreContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({
  store,
  children,
}: {
  store: AuthStore;
  children: React.ReactNode;
}) {
  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore(): AuthStore {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error("useAuthStore must be used within AuthStoreProvider");
  }
  return store;
}
