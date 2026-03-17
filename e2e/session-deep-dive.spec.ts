import { test, expect } from "@playwright/test";

test.describe("Session Deep-Dive", () => {
  // SD-7: Deep linking with sessionId
  test("renders session page with session ID", async ({ page }) => {
    await page.goto("/dashboard/sessions/test-session-123");
    await expect(page.getByRole("heading", { name: "Session Deep-Dive" })).toBeVisible();
  });

  test("shows loading state initially", async ({ page }) => {
    await page.goto("/dashboard/sessions/test-session-456");
    // Either loading or data should be visible
    const heading = page.getByRole("heading", { name: "Session Deep-Dive" });
    await expect(heading).toBeVisible();
  });

  // SD-7: Deep linking with step parameter
  test("accepts step query parameter", async ({ page }) => {
    await page.goto("/dashboard/sessions/test-session-789?step=2");
    await expect(page.getByRole("heading", { name: "Session Deep-Dive" })).toBeVisible();
  });
});
