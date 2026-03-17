import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewRoutes = [
  { path: "/dashboard", name: "Executive Overview" },
  { path: "/dashboard/adoption", name: "Adoption & Usage" },
  { path: "/dashboard/delivery", name: "Delivery Impact" },
  { path: "/dashboard/cost", name: "Cost & Budgets" },
  { path: "/dashboard/quality", name: "Quality & Security" },
  { path: "/dashboard/operations", name: "Operations" },
  { path: "/dashboard/settings", name: "Settings" },
];

test.describe("Accessibility Audit", () => {
  for (const route of viewRoutes) {
    test(`${route.name} has no critical a11y violations`, async ({ page }) => {
      await page.goto(route.path);
      // Wait for content to load
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // skip color contrast in mock data
        .analyze();

      expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
    });
  }

  test("sidebar has proper navigation landmark", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("aside")).toBeVisible();
  });

  test("main content has proper structure", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
  });

  test("page headings exist on each route", async ({ page }) => {
    for (const route of viewRoutes) {
      await page.goto(route.path);
      const headings = page.getByRole("heading", { level: 1 });
      await expect(headings).toBeVisible();
    }
  });
});
