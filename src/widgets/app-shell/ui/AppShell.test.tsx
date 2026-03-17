import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { AppShell } from "./AppShell";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("AppShell", () => {
  it("renders sidebar, header, and main content", () => {
    render(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    );

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders navigation in sidebar", () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders header actions", () => {
    render(
      <AppShell headerActions={<button>Theme</button>}>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });

  it("renders mobile hamburger button", () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByRole("button", { name: "Toggle navigation" })).toBeInTheDocument();
  });

  it("toggles mobile sidebar on hamburger click", async () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    // Mobile sidebar is now open — there should be 2 navs
    const navs = screen.getAllByRole("navigation", { name: "Main navigation" });
    expect(navs.length).toBe(2);
  });

  it("passes jest-axe", async () => {
    const { container } = render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
