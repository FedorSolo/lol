import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("redirects / to the default locale (/ru)", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ru$/);
  });

  test("shows the hero headline and CTA buttons", async ({ page }) => {
    await page.goto("/ru");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /подать заявку/i }).first()).toBeVisible();
  });

  test("main navigation sections are reachable via anchor links", async ({ page }) => {
    await page.goto("/ru");
    await page.getByRole("link", { name: "Экспедиции" }).first().click();
    await expect(page.locator("#expeditions")).toBeInViewport();
  });

  test("language switcher changes the URL and page content", async ({ page }) => {
    await page.goto("/ru");
    await page.getByRole("button", { name: "EN" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("footer renders on the homepage", async ({ page }) => {
    await page.goto("/ru");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
  });
});
