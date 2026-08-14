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

const gatePassword = process.env.SITE_PASSWORD?.trim() ?? "";

async function unlock(page: import("@playwright/test").Page, password: string) {
  const response = await page.request.post("/api/unlock", {
    data: { password },
  });
  expect(response.ok()).toBeTruthy();
}

test.describe("public routes", () => {
  test.beforeEach(async ({ page }) => {
    if (gatePassword) {
      await unlock(page, gatePassword);
    }
  });

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

test.describe("password gate", () => {
  test.skip(
    !gatePassword,
    "SITE_PASSWORD is not set, so the site is intentionally public",
  );

  test("sends an unlocked visitor to the gate", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL(/\/unlock\?next=%2Fabout$/);
    await expect(
      page.getByRole("heading", { name: "This site is not public yet" }),
    ).toBeVisible();
  });

  test("refuses the wrong password", async ({ page }) => {
    await page.goto("/unlock");
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "View site" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "That password is not correct",
    );
  });

  test("lands on the requested page after unlocking", async ({ page }) => {
    await page.goto("/press");
    await page.getByLabel("Password").fill(gatePassword);
    await page.getByRole("button", { name: "View site" }).click();
    await expect(page).toHaveURL(/\/press$/);
    await expect(page.getByRole("heading", { name: "Press Releases" })).toBeVisible();
  });
});
