import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";


export const ENV = {
  standardUser: process.env.STANDARDUSER!,
  password: process.env.USERPASSWORD!,
  lockedUser: process.env.LOCKEDOUTUSER!,
};


  test("Standard user can log in successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(ENV.standardUser, ENV.password);
    await productsPage.verifyProductsPage();


  });

  test("Locked out user cannot log in", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(ENV.lockedUser,ENV.password);
    await loginPage.verifyErrorMessage("Epic sadface: Sorry, this user has been locked out.");
    await loginPage.verifyLoginPage();

  });
