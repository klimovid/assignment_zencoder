import { test, expect, devices } from "@playwright/test";

test.describe("Responsive", () => {
  // CC-7: Mobile sidebar
  test("mobile shows hamburger menu", async ({ browser }) => {
    const context = await browser.newContext({
      ...devices["iPhone 13"],
    });
    const page = await context.newPage();
    await page.goto("/dashboard");

    // Desktop sidebar should be hidden on mobile
    await expect(page.getByRole("button", { name: "Toggle navigation" })).toBeVisible();

    await context.close();
  });

  // CC-8: Desktop sidebar visible
  test("desktop shows sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    // Sidebar should be visible as <aside>
    await expect(page.locator("aside")).toBeVisible();
  });
});
