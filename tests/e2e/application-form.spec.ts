import { test, expect } from "@playwright/test";

test.describe("Application form", () => {
  test("renders all required fields", async ({ page }) => {
    await page.goto("/ru");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await expect(page.locator("#first_name")).toBeVisible();
    await expect(page.locator("#last_name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#expedition_id")).toBeVisible();
    await expect(page.locator("#consent")).toBeVisible();
  });

  test("browser validation blocks submit when required fields are empty", async ({ page }) => {
    await page.goto("/ru");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /отправить заявку/i }).click();

    // A required field should still be present/focused — the success
    // message must NOT appear, confirming native validation blocked it.
    await expect(page.getByText(/заявка принята/i)).not.toBeVisible();
  });

  // Writes a real row to the `applications` table. Skipped by default —
  // run with E2E_SUBMIT_APPLICATION=true only against a test/staging
  // Supabase project, never production, and clean up the row afterwards.
  test("submitting a fully filled form shows the success state", async ({ page }) => {
    test.skip(
      process.env.E2E_SUBMIT_APPLICATION !== "true",
      "Set E2E_SUBMIT_APPLICATION=true to run this against a disposable Supabase project."
    );

    await page.goto("/ru");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.fill("#first_name", "Playwright");
    await page.fill("#last_name", "TestRunner");
    await page.fill("#email", "playwright-e2e@example.com");
    await page.fill("#country", "Test");
    await page.fill("#age", "30");
    await page.check("#consent");

    await page.getByRole("button", { name: /отправить заявку/i }).click();
    await expect(page.getByText(/заявка принята/i)).toBeVisible({ timeout: 10_000 });
  });
});
