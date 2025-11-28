import { Page } from '@playwright/test';

export interface ProductInfo {
    name: string;
    price: string;
}

export class ProductsPage {
    constructor(private page: Page) { }

    async findProductByName(productName: string): Promise<ProductInfo> {
        // Localizar el producto por nombre
        const productItem = this.page.locator(
            `//div[@class="inventory_item"]//a[contains(., "${productName}")]`
        );

        // Obtener nombre y precio
        const name = await productItem.textContent();
        const price = await productItem
            .locator('../..//span[@class="inventory_item_price"]')
            .textContent();

        return {
            name: name || '',
            price: price || '',
        };
    }

    async addProductToCart(productName: string) {
        const addButton = this.page.locator(
            `//a[contains(., "${productName}")]/../../..//button[contains(@class, "btn_inventory")]`
        );

        await addButton.click();
    }

    async openCart() {
        await this.page.locator('.shopping_cart_link').click();
    }
}
