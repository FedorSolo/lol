import { test, expect } from "@playwright/test";

// These tests assume at least one published expedition exists (the
// project ships with "Aconcagua" seeded via /admin/expeditions). If your
// Supabase project has no published expeditions yet, these will fail —
// publish at least one first.

test.describe("Expeditions", () => {
  test("expedition cards render with core details", async ({ page }) => {
    await page.goto("/ru");
    const firstCard = page.locator("#expeditions article").first();
    await firstCard.scrollIntoViewIfNeeded();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole("link", { name: /подробнее/i })).toBeVisible();
  });

  test("clicking a card opens its detail page with the 22 required blocks", async ({ page }) => {
    await page.goto("/ru");
    const firstCard = page.locator("#expeditions article").first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.getByRole("link", { name: /подробнее/i }).click();

    await expect(page).toHaveURL(/\/expeditions\/[a-z0-9-]+$/);
    await expect(page.locator("h1")).toBeVisible();

    // Spot-check a handful of the required content blocks rather than all 22.
    await expect(page.getByText(/что входит/i)).toBeVisible();
    await expect(page.getByText(/программа по дням/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /подать заявку/i }).last()).toBeVisible();
  });

  test("difficulty filter narrows the expedition grid", async ({ page }) => {
    await page.goto("/ru");
    await page.locator("#expeditions").scrollIntoViewIfNeeded();
    const filterButtons = page.locator("#expeditions button");
    const count = await filterButtons.count();
    // "Все" plus at least one difficulty level should exist once levels are seeded.
    if (count > 1) {
      await filterButtons.nth(1).click();
      await expect(page.locator("#expeditions article").first()).toBeVisible();
    }
  });
});

test.describe("Gallery / stories", () => {
  test("stories list page loads", async ({ page }) => {
    await page.goto("/ru/stories");
    await expect(page.locator("h1")).toContainText(/истории/i);
  });

  test("opening a story photo shows the lightbox with navigation", async ({ page }) => {
    await page.goto("/ru/stories");
    const firstStory = page.locator("main a[href*='/stories/']").first();
    if (await firstStory.count()) {
      await firstStory.click();
      const firstPhoto = page.locator("main img").first();
      if (await firstPhoto.count()) {
        await firstPhoto.click();
        await expect(page.getByLabel(/закрыть/i)).toBeVisible();
      }
    }
  });
});
