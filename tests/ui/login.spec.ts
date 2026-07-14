import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";

const USERS = {
  standard: {
    username: "standard_user",
    password: "secret_sauce",
  },
  locked: {
    username: "locked_out_user",
    password: "secret_sauce",
  },
};

test.describe("Login", () => {
  test("Standard user can log in successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step("Open login page", async () => {
      await loginPage.goto();
    });

    await test.step("Login with valid credentials", async () => {
      await loginPage.login(
        USERS.standard.username,
        USERS.standard.password
      );
    });

    await test.step("Verify products page", async () => {
      await productsPage.verifyProductsPage();
    });
  });

  test("Locked out user cannot log in", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      USERS.locked.username,
      USERS.locked.password
    );

    await loginPage.verifyErrorMessage(
      "Epic sadface: Sorry, this user has been locked out."
    );

    await loginPage.verifyLoginPage();
  });
});