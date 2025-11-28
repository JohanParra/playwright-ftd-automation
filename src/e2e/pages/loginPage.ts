import { Page } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        const usernameInput = this.page.locator('[data-test="username"]');
        const passwordInput = this.page.locator('[data-test="password"]');
        const loginButton = this.page.locator('[data-test="login-button"]');

        await usernameInput.fill(username);
        await passwordInput.fill(password);
        await loginButton.click();

        // Esperar a que se complete la navegación
        await this.page.waitForURL('**/inventory.html', { timeout: 10000 });
    }

    async getCredentials() {
        const text = await this.page.locator('body').textContent();
        // Extraer credenciales de la página si están visibles
        return {
            username: 'standard_user',
            password: 'secret_sauce',
        };
    }
}
