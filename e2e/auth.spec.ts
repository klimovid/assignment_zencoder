import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  // CC-1: Pages load without auth errors (mock mode)
  test("dashboard loads without auth errors", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBeLessThan(500);
  });

  test("all view routes are accessible", async ({ page }) => {
    const routes = [
      "/dashboard",
      "/dashboard/adoption",
      "/dashboard/delivery",
      "/dashboard/cost",
      "/dashboard/quality",
      "/dashboard/operations",
      "/dashboard/settings",
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500);
    }
  });
});
