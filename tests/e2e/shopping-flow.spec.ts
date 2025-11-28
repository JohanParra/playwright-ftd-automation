import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/e2e/pages/loginPage';
import { ProductsPage, ProductInfo } from '../../src/e2e/pages/productsPage';
import { CartPage } from '../../src/e2e/pages/cartPage';
import { CheckoutPage } from '../../src/e2e/pages/checkoutPage';

test.describe('E2E Shopping Flow - Sauce Demo', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let capturedProduct: ProductInfo;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Navegar a la página de login
        await loginPage.goto();
        
        // Validar que estamos en la página correcta
        await expect(page).toHaveURL(/.*saucedemo.*/, { timeout: 5000 });
    });

    test('Should complete full shopping flow successfully', async ({ page }) => {
        console.log('\n=== INICIO: Flujo E2E de Compra ===\n');

        // Step 1: Realizar login según criterios de aceptación
        console.log('[Step 1] Realizando login...');
        const credentials = await loginPage.getCredentials();
        expect(credentials.username).toBeTruthy();
        expect(credentials.password).toBeTruthy();
        
        await loginPage.login(credentials.username, credentials.password);
        
        // Validar que el login fue exitoso
        await expect(page).toHaveURL(/.*inventory.*/, { timeout: 10000 });
        console.log(`[Step 1] ✅ Login exitoso con usuario: ${credentials.username}\n`);

        // Step 2: Localizar producto "Sauce Labs Fleece Jacket" y capturar datos según criterios
        console.log('[Step 2] Localizando producto "Sauce Labs Fleece Jacket"...');
        const productName = 'Sauce Labs Fleece Jacket';
        capturedProduct = await productsPage.findProductByName(productName);

        // Validaciones explícitas según criterios de aceptación
        expect(capturedProduct.name).toBeTruthy();
        expect(capturedProduct.name).toContain('Fleece Jacket');
        expect(capturedProduct.price).toBeTruthy();
        expect(capturedProduct.price).not.toBe('');
        expect(capturedProduct.price).toMatch(/\$\d+\.\d{2}/); // Validar formato de precio
        
        console.log(`[Step 2] ✅ Producto capturado - Nombre: "${capturedProduct.name}", Precio: "${capturedProduct.price}"\n`);

        // Step 3: Añadir el producto al carrito según criterios
        console.log('[Step 3] Añadiendo producto al carrito...');
        await productsPage.addProductToCart(productName);
        
        // Validar que el producto se añadió (el botón cambia a "Remove")
        const addButton = page.locator(`//a[contains(., "${productName}")]/../../..//button[contains(@class, "btn_inventory")]`);
        await expect(addButton).toHaveText(/Remove/i, { timeout: 3000 });
        console.log('[Step 3] ✅ Producto añadido al carrito exitosamente\n');

        // Step 4: Ir al carrito de compras
        console.log('[Step 4] Navegando al carrito de compras...');
        await productsPage.openCart();
        
        // Validar que estamos en la página del carrito
        await expect(page).toHaveURL(/.*cart.*/, { timeout: 5000 });
        console.log('[Step 4] ✅ Navegación al carrito completada\n');

        // Step 5: Validar que nombre y precio coinciden según criterios de aceptación
        console.log('[Step 5] Validando datos del producto en el carrito...');
        const cartProduct = await cartPage.getCartItem(productName);

        // Validaciones explícitas según criterios de aceptación
        expect(cartProduct.name).toBeTruthy();
        expect(cartProduct.price).toBeTruthy();
        expect(cartProduct.name).toBe(capturedProduct.name);
        expect(cartProduct.price).toBe(capturedProduct.price);
        
        console.log(`[Step 5] ✅ Validación exitosa - Nombre coincide: "${cartProduct.name}", Precio coincide: "${cartProduct.price}"\n`);

        // Step 6: Continuar con checkout
        console.log('[Step 6] Procediendo al checkout...');
        await cartPage.proceedToCheckout();
        
        // Validar que estamos en la página de información de checkout
        await expect(page).toHaveURL(/.*checkout-step-one.*/, { timeout: 5000 });
        console.log('[Step 6] ✅ Navegación al checkout completada\n');

        // Step 7: Completar información de checkout
        console.log('[Step 7] Completando información de checkout...');
        const checkoutData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            zipCode: '080001'
        };
        
        await checkoutPage.fillCheckoutInfo(checkoutData.firstName, checkoutData.lastName, checkoutData.zipCode);
        
        // Validar que los campos se completaron correctamente
        await expect(page.locator('[data-test="firstName"]')).toHaveValue(checkoutData.firstName);
        await expect(page.locator('[data-test="lastName"]')).toHaveValue(checkoutData.lastName);
        await expect(page.locator('[data-test="postalCode"]')).toHaveValue(checkoutData.zipCode);
        
        await checkoutPage.continueCheckout();
        
        // Validar que estamos en la página de resumen
        await expect(page).toHaveURL(/.*checkout-step-two.*/, { timeout: 5000 });
        console.log('[Step 7] ✅ Información de checkout completada\n');

        // Step 8: Finalizar orden según criterios de aceptación
        console.log('[Step 8] Finalizando orden...');
        await checkoutPage.finishOrder();
        
        // Validar que estamos en la página de confirmación
        await expect(page).toHaveURL(/.*checkout-complete.*/, { timeout: 5000 });
        console.log('[Step 8] ✅ Orden finalizada\n');

        // Step 9: Validar confirmación de orden según criterios de aceptación
        console.log('[Step 9] Validando confirmación de orden...');
        const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();
        
        // Validaciones explícitas según criterios de aceptación
        expect(confirmationMessage).toBeTruthy();
        expect(confirmationMessage).toContain('Thank you');
        expect(confirmationMessage.length).toBeGreaterThan(0);
        
        console.log(`[Step 9] ✅ Confirmación recibida: "${confirmationMessage}"\n`);

        console.log('=== FIN: Flujo de compra completado exitosamente ===\n');
    });
});
