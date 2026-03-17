import { test, expect } from "@playwright/test";

test.describe("Quality & Security", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/quality");
  });

  // QA-1: CI pass rate
  test("renders CI pass rate", async ({ page }) => {
    await expect(page.getByText("CI Pass Rate")).toBeVisible();
  });

  // QA-2: Review outcomes
  test("renders review outcomes", async ({ page }) => {
    await expect(page.getByText("Review Outcomes")).toBeVisible();
  });

  // QA-3: Policy violations
  test("renders policy violations section", async ({ page }) => {
    await expect(page.getByText("Policy Violations")).toBeVisible();
  });
});
