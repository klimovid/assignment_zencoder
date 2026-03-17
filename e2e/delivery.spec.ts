import { test, expect } from "@playwright/test";

test.describe("Delivery Impact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/delivery");
  });

  // DL-1: Agent vs non-agent
  test("renders agent comparison", async ({ page }) => {
    await expect(page.getByText("Agent vs Non-Agent")).toBeVisible();
  });

  // DL-2: Time metrics
  test("renders time-to-merge metric", async ({ page }) => {
    await expect(page.getByText("Median Time to Merge")).toBeVisible();
  });

  // DL-4: PR throughput
  test("renders PR throughput KPIs", async ({ page }) => {
    await expect(page.getByText("Agent PRs Opened")).toBeVisible();
    await expect(page.getByText("Agent PRs Merged")).toBeVisible();
  });
});
