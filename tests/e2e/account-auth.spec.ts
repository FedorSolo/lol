import { test, expect } from "@playwright/test";

test.describe("Client portal auth", () => {
  test("/account/login itself does not redirect (regression test for the redirect-loop bug)", async ({ page }) => {
    const response = await page.goto("/account/login");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/account\/login$/);
    await expect(page.locator("#email")).toBeVisible();
  });

  test("unauthenticated visitors to /account are redirected to /account/login (not a loop)", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/account\/login$/);
  });

  test("unauthenticated visitors to /account/trip are redirected to /account/login", async ({ page }) => {
    await page.goto("/account/trip");
    await expect(page).toHaveURL(/\/account\/login$/);
  });

  test("wrong credentials show an error instead of navigating away", async ({ page }) => {
    await page.goto("/account/login");
    await page.fill("#email", "nobody@example.com");
    await page.fill("#password", "wrong-password");
    await page.getByRole("button", { name: /войти/i }).click();

    await expect(page.getByText(/неверный email или пароль/i)).toBeVisible();
    await expect(page).toHaveURL(/\/account\/login$/);
  });

  // Requires a real client account — set these to a test client's
  // credentials (create one via /admin/applications "Пригласить клиента").
  test("valid client credentials reach the portal", async ({ page }) => {
    const email = process.env.E2E_CLIENT_EMAIL;
    const password = process.env.E2E_CLIENT_PASSWORD;
    test.skip(!email || !password, "Set E2E_CLIENT_EMAIL / E2E_CLIENT_PASSWORD to run this test.");

    await page.goto("/account/login");
    await page.fill("#email", email!);
    await page.fill("#password", password!);
    await page.getByRole("button", { name: /войти/i }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText(/здравствуйте/i)).toBeVisible();
  });
});
