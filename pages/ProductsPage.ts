import { Page, Locator, expect } from "@playwright/test";

export class ProductsPage {
  private readonly pageTitle: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]')
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.sortDropdown = page.locator("select.product_sort_container");
    this.productPrices = page.locator(".inventory_item_price");
  }

  async verifyProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html$/);
    await expect(this.pageTitle).toHaveText("Products");
  }

  async addProductToCart(productName: string): Promise<void> {
    const slug = productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async verifyCartBadge(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(count.toString());
  }

  async sortByLowToHigh(): Promise<void> {
    await this.sortDropdown.selectOption("lohi");
  }

  async verifyProductsSortedByPrice(): Promise<void> {
    const prices = (await this.productPrices.allInnerTexts()).map(price =>
      Number(price.replace("$", ""))
    );

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }
}