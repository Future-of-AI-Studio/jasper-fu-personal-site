import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/press",
  "/press/media-coverage",
  "/speaking",
  "/media-kit",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/legal",
];

test.describe("public routes", () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("home does not advertise uncleared partner logos", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Jasper Fu", exact: true })).toBeVisible();
    await expect(page.getByText("Hashlock")).toHaveCount(0);
  });
});
