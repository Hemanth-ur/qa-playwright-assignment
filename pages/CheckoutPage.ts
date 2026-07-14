import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  private readonly cartIcon: Locator;
  private readonly checkoutButton: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly postalCode: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly successMessage: Locator;

  constructor(private readonly page: Page) {
    this.cartIcon = page.locator(".shopping_cart_link");
    this.checkoutButton = page.locator('[data-test="checkout"]')
    this.firstName = page.locator('[data-test="firstName"]')
    this.lastName = page.locator('[data-test="lastName"]')
    this.postalCode = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.finishButton = page.locator('[data-test="finish"]')
    this.successMessage = page.locator('[data-test="complete-header"]')
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/cart\.html$/);
  }

  async checkout(first: string, last: string, zip: string): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html$/);

    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);

    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html$/);

    await this.finishButton.click();
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html$/);
    await expect(this.successMessage).toHaveText("Thank you for your order!");
  }
}