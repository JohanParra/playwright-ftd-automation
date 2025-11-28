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

        // Navegar a la página
        await loginPage.goto();
    });

    test('Should complete full shopping flow successfully', async ({ page }) => {
        // Step 1: Realizar login
        const credentials = await loginPage.getCredentials();
        await loginPage.login(credentials.username, credentials.password);

        // Step 2: Localizar producto y capturar datos
        const productName = 'Sauce Labs Fleece Jacket';
        capturedProduct = await productsPage.findProductByName(productName);

        console.log('✅ Producto capturado:', capturedProduct);
        expect(capturedProduct.name).toContain('Fleece Jacket');
        expect(capturedProduct.price).not.toBeNull();

        // Step 3: Añadir al carrito
        await productsPage.addProductToCart(productName);

        // Step 4: Ir al carrito
        await productsPage.openCart();

        // Step 5: Validar que los datos coincidan
        const cartProduct = await cartPage.getCartItem(productName);

        console.log('✅ Producto en carrito:', cartProduct);
        expect(cartProduct.name).toBe(capturedProduct.name);
        expect(cartProduct.price).toBe(capturedProduct.price);

        // Step 6: Continuar con checkout
        await cartPage.proceedToCheckout();

        // Step 7: Completar información
        await checkoutPage.fillCheckoutInfo('Juan', 'Pérez', '080001');
        await checkoutPage.continueCheckout();

        // Step 8: Finalizar orden
        await checkoutPage.finishOrder();

        // Step 9: Validar confirmación
        const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();
        expect(confirmationMessage).toContain('Thank you');

        console.log('✅ Flujo de compra completado exitosamente');
    });
});
