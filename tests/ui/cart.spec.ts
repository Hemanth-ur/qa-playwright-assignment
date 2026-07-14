import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";

test.describe("Cart", () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      "standard_user",
      "secret_sauce"
    );
  });

  test("Adding two products updates cart badge", async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await test.step("Add first product", async () => {
      await productsPage.addProductToCart("Sauce Labs Backpack");
    });

    await test.step("Add second product", async () => {
      await productsPage.addProductToCart("Sauce Labs Bike Light");
    });

    await test.step("Verify cart badge", async () => {
      await productsPage.verifyCartBadge(2);
    });

  });

  test("Sort products by price low to high", async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await productsPage.sortByLowToHigh();

    await productsPage.verifyProductsSortedByPrice();

  });

});