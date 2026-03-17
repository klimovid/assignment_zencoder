import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "./UserMenu";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "eng_manager",
};

describe("UserMenu", () => {
  const onLogout = jest.fn();
  const onNavigateSettings = jest.fn();

  beforeEach(() => {
    onLogout.mockClear();
    onNavigateSettings.mockClear();
  });

  it("renders user menu button", () => {
    render(
      <UserMenu user={mockUser} onLogout={onLogout} onNavigateSettings={onNavigateSettings} />,
    );
    expect(screen.getByRole("button", { name: "User menu" })).toBeInTheDocument();
  });

  it("opens dropdown showing profile info", async () => {
    render(
      <UserMenu user={mockUser} onLogout={onLogout} onNavigateSettings={onNavigateSettings} />,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "User menu" }));

    expect(screen.getByRole("menu", { name: "User actions" })).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("eng manager")).toBeInTheDocument();
  });

  it("renders avatar when avatarUrl is provided", () => {
    render(
      <UserMenu
        user={{ ...mockUser, avatarUrl: "/avatar.png" }}
        onLogout={onLogout}
        onNavigateSettings={onNavigateSettings}
      />,
    );
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();
  });

  it("calls onNavigateSettings when Settings is clicked", async () => {
    render(
      <UserMenu user={mockUser} onLogout={onLogout} onNavigateSettings={onNavigateSettings} />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "User menu" }));
    await user.click(screen.getByRole("menuitem", { name: /Settings/i }));

    expect(onNavigateSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onLogout when Log out is clicked", async () => {
    render(
      <UserMenu user={mockUser} onLogout={onLogout} onNavigateSettings={onNavigateSettings} />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "User menu" }));
    await user.click(screen.getByRole("menuitem", { name: /Log out/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("shows Identity Provider link", async () => {
    render(
      <UserMenu user={mockUser} onLogout={onLogout} onNavigateSettings={onNavigateSettings} />,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "User menu" }));
    expect(screen.getByRole("menuitem", { name: /Identity Provider/i })).toBeInTheDocument();
  });
});
