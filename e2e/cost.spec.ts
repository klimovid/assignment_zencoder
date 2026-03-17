import { test, expect } from "@playwright/test";

test.describe("Cost & Budgets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/cost");
  });

  // CO-1: Budget KPI
  test("renders spend and budget KPIs", async ({ page }) => {
    await expect(page.getByText("Current Spend")).toBeVisible();
    await expect(page.getByText("Budget Limit")).toBeVisible();
  });

  // CO-3: Forecast
  test("renders forecast section", async ({ page }) => {
    await expect(page.getByText("Forecast")).toBeVisible();
  });

  // CO-5: Cost per task
  test("renders cost per task", async ({ page }) => {
    await expect(page.getByText("Cost per Task")).toBeVisible();
  });

  test("renders spend by model", async ({ page }) => {
    await expect(page.getByText("Spend by Model")).toBeVisible();
  });
});
