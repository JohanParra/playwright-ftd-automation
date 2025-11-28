import { Page, expect } from '@playwright/test';
import { ProductInfo } from './productsPage';

/**
 * Page Object para la página del carrito de compras de Sauce Demo
 */
export class CartPage {
    constructor(private page: Page) { }

    /**
     * Obtiene la información de un item del carrito por su nombre
     * @param productName - Nombre del producto en el carrito
     * @returns Información del producto (nombre y precio)
     * @throws Error si el producto no se encuentra en el carrito
     */
    async getCartItem(productName: string): Promise<ProductInfo> {
        try {
            // Localizar el contenedor del item del carrito por nombre
            const cartItemContainer = this.page.locator(
                `//div[@class="cart_item"][.//a[contains(., "${productName}")]]`
            );

            // Validar que el item existe en el carrito
            await expect(cartItemContainer).toBeVisible({ timeout: 5000 });

            // Obtener nombre y precio desde el contenedor
            const nameElement = cartItemContainer.locator('.inventory_item_name');
            const priceElement = cartItemContainer.locator('.inventory_item_price');

            await expect(nameElement).toBeVisible({ timeout: 3000 });
            await expect(priceElement).toBeVisible({ timeout: 3000 });

            const name = await nameElement.textContent();
            const price = await priceElement.textContent();

            if (!name || !price) {
                throw new Error(`No se pudo obtener información completa del producto "${productName}" en el carrito`);
            }

            return {
                name: name.trim(),
                price: price.trim(),
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('toBeVisible')) {
                throw new Error(`Error: El producto "${productName}" no se encontró en el carrito de compras`);
            }
            throw new Error(`Error al obtener información del producto "${productName}" del carrito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Procede al checkout desde el carrito
     * @throws Error si el botón de checkout no se encuentra o no se puede hacer clic
     */
    async proceedToCheckout(): Promise<void> {
        try {
            const checkoutButton = this.page.locator('[data-test="checkout"]');
            await expect(checkoutButton).toBeVisible({ timeout: 5000 });
            await expect(checkoutButton).toBeEnabled({ timeout: 3000 });
            await checkoutButton.click();
            await this.page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });
        } catch (error) {
            throw new Error(`Error al proceder al checkout: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}
