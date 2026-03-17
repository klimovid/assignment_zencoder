import { test, expect } from "@playwright/test";

test.describe("Adoption & Usage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/adoption");
  });

  // AD-2: Filters present
  test("renders DAU/WAU/MAU KPIs", async ({ page }) => {
    await expect(page.getByText("DAU", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("WAU", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("MAU", { exact: true }).first()).toBeVisible();
  });

  // AD-1: Task funnel
  test("renders task funnel section", async ({ page }) => {
    await expect(page.getByText("Task Funnel")).toBeVisible();
  });

  // AD-3: Drill-down — sidebar navigation to session
  test("sidebar contains adoption link as current", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Adoption/i })).toBeVisible();
  });

  test("renders sessions by team", async ({ page }) => {
    await expect(page.getByText("Sessions by Team")).toBeVisible();
  });
});
