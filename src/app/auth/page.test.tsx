import { render, screen } from "@testing-library/react";
import AuthPage from "./page";

describe("AuthPage", () => {
  it("renders page heading", () => {
    render(<AuthPage />);
    expect(screen.getByRole("heading", { name: /Cloud Agent Platform/i })).toBeInTheDocument();
  });

  it("renders 7 mock user cards", () => {
    render(<AuthPage />);
    const roles = [
      "org_admin",
      "vp_cto",
      "eng_manager",
      "platform_eng",
      "ic_dev",
      "finops",
      "security",
    ];
    roles.forEach((role) => {
      expect(screen.getByTestId(`login-${role}`)).toBeInTheDocument();
    });
  });

  it("each card links to callback with role parameter", () => {
    render(<AuthPage />);
    const link = screen.getByTestId("login-eng_manager");
    expect(link).toHaveAttribute("href", "/api/auth/callback?role=eng_manager");
  });

  it("shows user names", () => {
    render(<AuthPage />);
    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.getByText("Carol Manager")).toBeInTheDocument();
    expect(screen.getByText("Grace Security")).toBeInTheDocument();
  });
});
