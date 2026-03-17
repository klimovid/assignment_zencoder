import { test, expect } from "@playwright/test";

test.describe("Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/operations");
  });

  // OP-1: Queue depth
  test("renders queue depth", async ({ page }) => {
    await expect(page.getByText("Queue Depth")).toBeVisible();
  });

  // OP-2: Failure rate
  test("renders failure rate and categories", async ({ page }) => {
    await expect(page.getByText("Failure Rate")).toBeVisible();
    await expect(page.getByText("Failure Categories")).toBeVisible();
  });

  // OP-3: SLA compliance
  test("renders SLA compliance", async ({ page }) => {
    await expect(page.getByText("SLA Compliance")).toBeVisible();
  });

  // OP-5: Wait time metrics
  test("renders wait time metrics", async ({ page }) => {
    await expect(page.getByText("Median Wait")).toBeVisible();
  });
});
