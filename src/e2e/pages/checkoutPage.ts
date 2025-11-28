import { Page, expect } from '@playwright/test';

/**
 * Page Object para la página de checkout de Sauce Demo
 */
export class CheckoutPage {
    constructor(private page: Page) { }

    /**
     * Completa el formulario de información de checkout
     * @param firstName - Nombre del cliente
     * @param lastName - Apellido del cliente
     * @param zipCode - Código postal
     * @throws Error si algún campo no se encuentra o no se puede completar
     */
    async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
        try {
            const firstNameInput = this.page.locator('[data-test="firstName"]');
            const lastNameInput = this.page.locator('[data-test="lastName"]');
            const zipCodeInput = this.page.locator('[data-test="postalCode"]');

            // Validar que los campos están visibles
            await expect(firstNameInput).toBeVisible({ timeout: 5000 });
            await expect(lastNameInput).toBeVisible({ timeout: 5000 });
            await expect(zipCodeInput).toBeVisible({ timeout: 5000 });

            await firstNameInput.fill(firstName);
            await lastNameInput.fill(lastName);
            await zipCodeInput.fill(zipCode);

            // Validar que los valores se ingresaron correctamente
            await expect(firstNameInput).toHaveValue(firstName);
            await expect(lastNameInput).toHaveValue(lastName);
            await expect(zipCodeInput).toHaveValue(zipCode);
        } catch (error) {
            throw new Error(`Error al completar información de checkout: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Continúa al siguiente paso del checkout
     * @throws Error si el botón de continuar no se encuentra o la navegación falla
     */
    async continueCheckout(): Promise<void> {
        try {
            const continueButton = this.page.locator('[data-test="continue"]');
            await expect(continueButton).toBeVisible({ timeout: 5000 });
            await expect(continueButton).toBeEnabled({ timeout: 3000 });
            await continueButton.click();
            await this.page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });
        } catch (error) {
            throw new Error(`Error al continuar con el checkout: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Finaliza la orden de compra
     * @throws Error si el botón de finalizar no se encuentra o la navegación falla
     */
    async finishOrder(): Promise<void> {
        try {
            const finishButton = this.page.locator('[data-test="finish"]');
            await expect(finishButton).toBeVisible({ timeout: 5000 });
            await expect(finishButton).toBeEnabled({ timeout: 3000 });
            await finishButton.click();
            await this.page.waitForURL('**/checkout-complete.html', { timeout: 5000 });
        } catch (error) {
            throw new Error(`Error al finalizar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Obtiene el mensaje de confirmación de la orden
     * @returns Mensaje de confirmación
     * @throws Error si el mensaje no se encuentra
     */
    async getOrderConfirmationMessage(): Promise<string> {
        try {
            const messageElement = this.page.locator('.complete-header');
            await expect(messageElement).toBeVisible({ timeout: 5000 });
            const message = await messageElement.textContent();
            
            if (!message) {
                throw new Error('El mensaje de confirmación está vacío');
            }
            
            return message.trim();
        } catch (error) {
            throw new Error(`Error al obtener mensaje de confirmación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}
