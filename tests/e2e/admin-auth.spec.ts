import { test, expect } from "@playwright/test";

test.describe("Admin auth", () => {
  test("unauthenticated visitors are redirected to the login page", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("login page renders the form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("wrong credentials show an error instead of navigating away", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", "nobody@example.com");
    await page.fill("#password", "wrong-password");
    await page.getByRole("button", { name: /войти/i }).click();

    await expect(page.getByText(/неверный email или пароль/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  // Requires real admin credentials — set these in your local .env or CI
  // secrets. Skipped automatically if they're not present.
  test("valid credentials reach the dashboard", async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, "Set E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD to run this test.");

    await page.goto("/admin/login");
    await page.fill("#email", email!);
    await page.fill("#password", password!);
    await page.getByRole("button", { name: /войти/i }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText("Dashboard")).toBeVisible();
  });
});
