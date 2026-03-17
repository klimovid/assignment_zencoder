import { test, expect } from "@playwright/test";

// These tests authenticate as specific roles (NOT org_admin) to verify RBAC.
// They don't use the global storageState — each test logs in fresh.
test.use({ storageState: { cookies: [], origins: [] } });

async function loginAs(page: import("@playwright/test").Page, role: string) {
  await page.goto(`/api/auth/callback?role=${role}`);
  await page.waitForURL(/\/dashboard/);
}

test.describe("RBAC — sidebar filtering", () => {
  test("finops sees only Dashboard, Cost, Settings", async ({ page }) => {
    await loginAs(page, "finops");
    await expect(page.getByText("Executive Overview")).toBeVisible();
    await expect(page.getByText("Cost & Budgets")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Adoption & Usage")).not.toBeVisible();
    await expect(page.getByText("Delivery Impact")).not.toBeVisible();
    await expect(page.getByText("Quality & Security")).not.toBeVisible();
    await expect(page.getByText("Operations")).not.toBeVisible();
  });

  test("security sees only Quality, Settings", async ({ page }) => {
    await loginAs(page, "security");
    await expect(page.getByText("Quality & Security")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Executive Overview")).not.toBeVisible();
    await expect(page.getByText("Adoption & Usage")).not.toBeVisible();
    await expect(page.getByText("Delivery Impact")).not.toBeVisible();
    await expect(page.getByText("Cost & Budgets")).not.toBeVisible();
    await expect(page.getByText("Operations")).not.toBeVisible();
  });

  test("platform_eng sees Adoption, Delivery, Operations, Settings", async ({ page }) => {
    await loginAs(page, "platform_eng");
    await expect(page.getByText("Adoption & Usage")).toBeVisible();
    await expect(page.getByText("Delivery Impact")).toBeVisible();
    await expect(page.getByText("Operations")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Executive Overview")).not.toBeVisible();
    await expect(page.getByText("Cost & Budgets")).not.toBeVisible();
    await expect(page.getByText("Quality & Security")).not.toBeVisible();
  });

  test("ic_dev sees Adoption, Delivery, Settings", async ({ page }) => {
    await loginAs(page, "ic_dev");
    await expect(page.getByText("Adoption & Usage")).toBeVisible();
    await expect(page.getByText("Delivery Impact")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Executive Overview")).not.toBeVisible();
    await expect(page.getByText("Cost & Budgets")).not.toBeVisible();
    await expect(page.getByText("Quality & Security")).not.toBeVisible();
    await expect(page.getByText("Operations")).not.toBeVisible();
  });
});

test.describe("RBAC — page access redirect", () => {
  test("security accessing /dashboard/operations redirects to /dashboard/quality", async ({ page }) => {
    await loginAs(page, "security");
    await page.goto("/dashboard/operations");
    await expect(page).toHaveURL(/\/dashboard\/quality/);
  });

  test("finops accessing /dashboard/adoption redirects to /dashboard", async ({ page }) => {
    await loginAs(page, "finops");
    await page.goto("/dashboard/adoption");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("ic_dev accessing /dashboard/cost redirects to /dashboard/adoption", async ({ page }) => {
    await loginAs(page, "ic_dev");
    await page.goto("/dashboard/cost");
    await expect(page).toHaveURL(/\/dashboard\/adoption/);
  });

  test("platform_eng accessing /dashboard/quality redirects to /dashboard/adoption", async ({ page }) => {
    await loginAs(page, "platform_eng");
    await page.goto("/dashboard/quality");
    await expect(page).toHaveURL(/\/dashboard\/adoption/);
  });
});

test.describe("RBAC — default login redirect", () => {
  test("finops login redirects to /dashboard", async ({ page }) => {
    await page.goto("/api/auth/callback?role=finops");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("security login redirects to /dashboard/quality", async ({ page }) => {
    await page.goto("/api/auth/callback?role=security");
    await expect(page).toHaveURL(/\/dashboard\/quality/);
  });

  test("platform_eng login redirects to /dashboard/adoption", async ({ page }) => {
    await page.goto("/api/auth/callback?role=platform_eng");
    await expect(page).toHaveURL(/\/dashboard\/adoption/);
  });

  test("ic_dev login redirects to /dashboard/adoption", async ({ page }) => {
    await page.goto("/api/auth/callback?role=ic_dev");
    await expect(page).toHaveURL(/\/dashboard\/adoption/);
  });
});
