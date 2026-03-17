"use client";

import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@features/theme-switching/ui/ThemeProvider";
import { AuthStoreProvider } from "@features/auth/model/AuthContext";
import { FilterStoreProvider } from "@features/filter-management/model/FilterContext";
import { URLSyncProvider } from "@features/filter-management/lib/URLSyncProvider";
import { RootStoreProvider } from "./store-context";
import { createRootStore, RootStore } from "./stores";
import { AuthInitializer } from "./auth-initializer";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [rootStore] = useState<RootStore>(() => createRootStore());
  const [queryClient] = useState<QueryClient>(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RootStoreProvider store={rootStore}>
        <AuthStoreProvider store={rootStore.auth}>
          <AuthInitializer>
            <FilterStoreProvider store={rootStore.filter}>
              <ThemeProvider>
                <Suspense>
                  <URLSyncProvider>
                    {children}
                  </URLSyncProvider>
                </Suspense>
              </ThemeProvider>
            </FilterStoreProvider>
          </AuthInitializer>
        </AuthStoreProvider>
      </RootStoreProvider>
    </QueryClientProvider>
  );
}
