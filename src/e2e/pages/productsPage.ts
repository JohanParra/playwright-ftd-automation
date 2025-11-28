import { Page, expect } from '@playwright/test';

/**
 * Interfaz para la información de un producto
 */
export interface ProductInfo {
    name: string;
    price: string;
}

/**
 * Page Object para la página de productos de Sauce Demo
 */
export class ProductsPage {
    constructor(private page: Page) { }

    /**
     * Busca un producto por su nombre y retorna su información
     * @param productName - Nombre del producto a buscar
     * @returns Información del producto (nombre y precio)
     * @throws Error si el producto no se encuentra
     */
    async findProductByName(productName: string): Promise<ProductInfo> {
        try {
            // Localizar el contenedor del producto por nombre
            const productContainer = this.page.locator(
                `//div[@class="inventory_item"][.//a[contains(., "${productName}")]]`
            );

            // Validar que el producto existe
            await expect(productContainer).toBeVisible({ timeout: 5000 });

            // Obtener nombre y precio desde el contenedor
            const nameElement = productContainer.locator('.inventory_item_name');
            const priceElement = productContainer.locator('.inventory_item_price');

            await expect(nameElement).toBeVisible({ timeout: 3000 });
            await expect(priceElement).toBeVisible({ timeout: 3000 });

            const name = await nameElement.textContent();
            const price = await priceElement.textContent();

            if (!name || !price) {
                throw new Error(`No se pudo obtener información completa del producto "${productName}"`);
            }

            return {
                name: name.trim(),
                price: price.trim(),
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('toBeVisible')) {
                throw new Error(`Error: El producto "${productName}" no se encontró en la página de productos`);
            }
            throw new Error(`Error al buscar producto "${productName}": ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Añade un producto al carrito de compras
     * @param productName - Nombre del producto a añadir
     * @throws Error si el botón no se encuentra o no se puede hacer clic
     */
    async addProductToCart(productName: string): Promise<void> {
        try {
            const addButton = this.page.locator(
                `//a[contains(., "${productName}")]/../../..//button[contains(@class, "btn_inventory")]`
            );

            await expect(addButton).toBeVisible({ timeout: 5000 });
            await expect(addButton).toBeEnabled({ timeout: 3000 });
            await addButton.click();

            // Validar que el botón cambió a "Remove" indicando que se añadió al carrito
            await expect(addButton).toHaveText(/Remove/i, { timeout: 3000 });
        } catch (error) {
            throw new Error(`Error al añadir producto "${productName}" al carrito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Abre el carrito de compras
     * @throws Error si el enlace del carrito no se encuentra
     */
    async openCart(): Promise<void> {
        try {
            const cartLink = this.page.locator('.shopping_cart_link');
            await expect(cartLink).toBeVisible({ timeout: 5000 });
            await cartLink.click();
            await this.page.waitForURL('**/cart.html', { timeout: 5000 });
        } catch (error) {
            throw new Error(`Error al abrir el carrito de compras: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}
