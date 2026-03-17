import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  // CC-2: Sidebar navigation
  test("sidebar contains all view links", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("link", { name: /Overview/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Adoption/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Delivery/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Cost/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Quality/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Operations/i })).toBeVisible();
  });

  test("navigates between views via sidebar", async ({ page }) => {
    await page.goto("/dashboard");

    await page.getByRole("link", { name: /Adoption/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/adoption/);
    await expect(page.getByRole("heading", { name: "Adoption & Usage" })).toBeVisible();

    await page.getByRole("link", { name: /Cost/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/cost/);
    await expect(page.getByRole("heading", { name: "Cost & Budgets" })).toBeVisible();
  });

  // CC-2: Browser back/forward
  test("browser back returns to previous view", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /Delivery/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/delivery/);

    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
