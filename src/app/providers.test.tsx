import { render, screen } from "@testing-library/react";

// Mock all providers to isolate composition test
jest.mock("@tanstack/react-query", () => ({
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));
jest.mock("@features/theme-switching/ui/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));
jest.mock("@features/auth/model/AuthContext", () => ({
  AuthStoreProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
}));
jest.mock("@features/filter-management/model/FilterContext", () => ({
  FilterStoreProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="filter-provider">{children}</div>,
}));
jest.mock("@features/filter-management/lib/URLSyncProvider", () => ({
  URLSyncProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="url-sync-provider">{children}</div>,
}));
jest.mock("./store-context", () => ({
  RootStoreProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="root-store-provider">{children}</div>,
}));

import { Providers } from "./providers";

describe("Providers", () => {
  it("renders children through provider tree", () => {
    render(
      <Providers>
        <div data-testid="child">Content</div>
      </Providers>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Content");
  });

  it("nests all providers in correct order", () => {
    render(
      <Providers>
        <span>inner</span>
      </Providers>,
    );
    // Outermost → innermost:
    // QueryClient > RootStore > Auth > Filter > Theme > URLSync > children
    expect(screen.getByTestId("query-provider")).toBeInTheDocument();
    expect(screen.getByTestId("root-store-provider")).toBeInTheDocument();
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("filter-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("url-sync-provider")).toBeInTheDocument();
  });

  it("mounts QueryClientProvider as outermost", () => {
    const { container } = render(
      <Providers>
        <span>x</span>
      </Providers>,
    );
    const qp = container.querySelector("[data-testid='query-provider']")!;
    expect(qp.querySelector("[data-testid='root-store-provider']")).toBeTruthy();
  });
});
