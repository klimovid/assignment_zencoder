import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "./ThemeProvider";

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it("renders with system theme label by default", () => {
    renderWithTheme();
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("cycles light → dark → system on clicks", async () => {
    renderWithTheme();
    const user = userEvent.setup();

    // system → light
    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();

    // light → dark
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(
      screen.getByRole("button", { name: "Switch to system mode" }),
    ).toBeInTheDocument();

    // dark → system
    await user.click(screen.getByRole("button", { name: "Switch to system mode" }));
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("persists theme preference", async () => {
    renderWithTheme();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(localStorage.getItem("dashboard-theme")).toBe("light");
  });
});
