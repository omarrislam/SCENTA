import { test, expect } from "@playwright/test";

test("checkout flow shows steps", async ({ page, request }) => {
  const email = `demo+${Date.now()}@scenta.com`;
  const registerResponse = await request.post("http://localhost:4000/api/auth/register", {
    data: { name: "Demo User", email, password: "demo1234" }
  });
  const registerPayload = await registerResponse.json();
  const token = registerPayload?.data?.token;
  const user = registerPayload?.data?.user;

  await page.addInitScript(
    ([tokenValue, userValue]) => {
      localStorage.setItem("scenta-token", tokenValue);
      localStorage.setItem("scenta-user", JSON.stringify(userValue));
    },
    [token, user]
  );

  await page.goto("/product/silk-amber");
  await page.getByRole("button", { name: "Add to cart" }).first().click();

  await page.goto("/checkout");
  await expect(page.getByText("Checkout")).toBeVisible();
  await expect(page.getByText("Step 1 of 4")).toBeVisible();
});
