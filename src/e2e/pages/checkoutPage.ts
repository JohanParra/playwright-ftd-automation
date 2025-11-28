import { Page } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) { }

    async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(zipCode);
    }

    async continueCheckout() {
        await this.page.locator('[data-test="continue"]').click();
        await this.page.waitForURL('**/checkout-step-two.html');
    }

    async finishOrder() {
        await this.page.locator('[data-test="finish"]').click();
        await this.page.waitForURL('**/checkout-complete.html');
    }

    async getOrderConfirmationMessage(): Promise<string> {
        const message = await this.page
            .locator('.complete-header')
            .textContent();
        return message || '';
    }
}
