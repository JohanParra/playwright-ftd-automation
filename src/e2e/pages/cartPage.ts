import { Page } from '@playwright/test';
import { ProductInfo } from './productsPage';

export class CartPage {
  constructor(private page: Page) {}

  async getCartItem(productName: string): Promise<ProductInfo> {
    const item = this.page.locator(
      `//div[@class="cart_item"]//a[contains(., "${productName}")]`
    );

    const name = await item.textContent();
    const price = await item
      .locator('../..//span[@class="inventory_item_price"]')
      .textContent();

    return {
      name: name || '',
      price: price || '',
    };
  }

  async proceedToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }
}
