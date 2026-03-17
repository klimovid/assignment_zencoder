import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { SettingsPage } from "./SettingsPage";
import { createUserProfile, createUserSettings } from "@shared/__mocks__/factories";

describe("SettingsPage", () => {
  const profile = createUserProfile();
  const settings = createUserSettings();

  // ST-1: Profile read-only display
  it("renders user profile info", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText(profile.data.name)).toBeInTheDocument();
    expect(screen.getByText(profile.data.email)).toBeInTheDocument();
  });

  // ST-2: Theme setting
  it("renders theme setting", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  // ST-3: Timezone setting
  it("renders timezone setting", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText("Timezone")).toBeInTheDocument();
  });

  // ST-4: Default view setting
  it("renders default view setting", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText("Default View")).toBeInTheDocument();
  });

  // ST-5: Email digest setting
  it("renders email digest setting", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText("Email Digest")).toBeInTheDocument();
  });

  it("renders organization info", () => {
    render(<SettingsPage profile={profile} settings={settings} />);
    expect(screen.getByText(profile.data.organization.name)).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<SettingsPage profile={null} settings={null} loading />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("passes accessibility audit", async () => {
    const { container } = render(
      <SettingsPage profile={profile} settings={settings} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
