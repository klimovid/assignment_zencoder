import { test, expect } from "@playwright/test";

test.describe("Executive Overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  // OV-5: Navigate, verify KPIs, switch time ranges
  test("displays 5 KPI cards", async ({ page }) => {
    await expect(page.getByRole("status", { name: "Active Users" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Total Sessions" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Accepted Outcome Rate" })).toBeVisible();
    await expect(page.getByRole("status", { name: "Cost per Task" })).toBeVisible();
    await expect(page.getByRole("status", { name: "CI Pass Rate" })).toBeVisible();
  });

  test("shows page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Executive Overview" })).toBeVisible();
  });

  test("does not show drill-down tables", async ({ page }) => {
    await expect(page.getByRole("table")).not.toBeVisible();
  });
});
