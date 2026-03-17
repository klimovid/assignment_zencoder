import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/settings");
  });

  // ST-1: Profile displayed
  test("renders settings page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  // ST-2: Theme setting
  test("renders theme setting", async ({ page }) => {
    await expect(page.getByText("Theme")).toBeVisible();
  });

  // ST-3: Timezone setting
  test("renders timezone setting", async ({ page }) => {
    await expect(page.getByText("Timezone")).toBeVisible();
  });

  // ST-4: Profile info
  test("renders profile section", async ({ page }) => {
    await expect(page.getByText("Profile")).toBeVisible();
  });

  // ST-5: Email digest
  test("renders notifications section", async ({ page }) => {
    await expect(page.getByText("Notifications")).toBeVisible();
  });
});
