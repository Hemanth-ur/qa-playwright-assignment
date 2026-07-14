import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CheckoutPage } from "../../pages/CheckoutPage";

test.describe("Checkout", () => {

  test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      "standard_user",
      "secret_sauce"
    );

  });

  test("Complete checkout successfully", async ({ page }) => {

    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step("Add products", async () => {

      await productsPage.addProductToCart("Sauce Labs Backpack");
      await productsPage.addProductToCart("Sauce Labs Bike Light");

      await productsPage.verifyCartBadge(2);

    });

    await test.step("Proceed to checkout", async () => {

      await checkoutPage.openCart();

      await checkoutPage.checkout(
        "Hemanth",
        "UR",
        "560001"
      );

    });

    await test.step("Verify order confirmation", async () => {

      await checkoutPage.verifyOrderConfirmation();

    });

  });

});