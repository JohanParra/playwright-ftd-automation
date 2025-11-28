import { Page, expect } from '@playwright/test';

/**
 * Page Object para la página de login de Sauce Demo
 */
export class LoginPage {
    constructor(private page: Page) { }

    /**
     * Navega a la página de login
     */
    async goto() {
        try {
            await this.page.goto('/');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Error al navegar a la página de login: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Realiza el login con las credenciales proporcionadas
     * @param username - Nombre de usuario
     * @param password - Contraseña
     * @throws Error si el login falla o la navegación no se completa
     */
    async login(username: string, password: string) {
        try {
            const usernameInput = this.page.locator('[data-test="username"]');
            const passwordInput = this.page.locator('[data-test="password"]');
            const loginButton = this.page.locator('[data-test="login-button"]');

            // Validar que los elementos están visibles
            await expect(usernameInput).toBeVisible({ timeout: 5000 });
            await expect(passwordInput).toBeVisible({ timeout: 5000 });
            await expect(loginButton).toBeVisible({ timeout: 5000 });

            await usernameInput.fill(username);
            await passwordInput.fill(password);
            await loginButton.click();

            // Esperar a que se complete la navegación
            await this.page.waitForURL('**/inventory.html', { timeout: 10000 });
        } catch (error) {
            if (error instanceof Error && error.message.includes('waitForURL')) {
                throw new Error(`Error en login: La navegación a la página de inventario falló. Verifique las credenciales. ${error.message}`);
            }
            throw new Error(`Error al realizar login: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    /**
     * Extrae las credenciales de la página de login
     * Busca las credenciales en el contenido de la página o en elementos específicos
     * @returns Objeto con username y password
     */
    async getCredentials(): Promise<{ username: string; password: string }> {
        try {
            // Intentar extraer credenciales desde el contenido de la página
            const pageContent = await this.page.locator('body').textContent() || '';
            
            // Buscar credenciales en el contenido de la página (Sauce Demo las muestra en la página)
            // Patrón común: "Accepted usernames are:" seguido de los usuarios
            const usernameMatch = pageContent.match(/standard_user|locked_out_user|problem_user|performance_glitch_user/);
            const passwordMatch = pageContent.match(/secret_sauce/);

            if (usernameMatch && passwordMatch) {
                return {
                    username: usernameMatch[0],
                    password: passwordMatch[0],
                };
            }

            // Si no se encuentran en el contenido, buscar en elementos específicos
            // Algunas páginas muestran las credenciales en divs o listas
            const credentialElements = await this.page.locator('body').allTextContents();
            for (const text of credentialElements) {
                if (text.includes('standard_user') && text.includes('secret_sauce')) {
                    return {
                        username: 'standard_user',
                        password: 'secret_sauce',
                    };
                }
            }

            // Fallback: usar credenciales por defecto si no se pueden extraer
            console.warn('No se pudieron extraer credenciales de la página, usando valores por defecto');
            return {
                username: 'standard_user',
                password: 'secret_sauce',
            };
        } catch (error) {
            console.warn(`Error al extraer credenciales: ${error instanceof Error ? error.message : 'Error desconocido'}, usando valores por defecto`);
            return {
                username: 'standard_user',
                password: 'secret_sauce',
            };
        }
    }
}
