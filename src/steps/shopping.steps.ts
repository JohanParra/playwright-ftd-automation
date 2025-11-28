import { Given, When, Then, setWorldConstructor, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { LoginPage } from '../e2e/pages/loginPage';
import { ProductsPage } from '../e2e/pages/productsPage';
import { CartPage } from '../e2e/pages/cartPage';
import { CheckoutPage } from '../e2e/pages/checkoutPage';

setWorldConstructor(World);

Before({ tags: '@e2e' }, async function (this: World) {
    await this.initBrowser();
});

After({ tags: '@e2e' }, async function (this: World) {
    await this.closeBrowser();
});

Given('navego a la página de Sauce Demo', async function (this: World) {
    if (!this.page) {
        await this.initBrowser();
    }
    
    this.loginPage = new LoginPage(this.page!);
    await this.loginPage.goto();
    await expect(this.page!).toHaveURL(/.*saucedemo.*/, { timeout: 5000 });
});

When('obtengo las credenciales de la página', async function (this: World) {
    if (!this.loginPage) {
        throw new Error('LoginPage is not initialized');
    }
    
    this.credentials = await this.loginPage.getCredentials();
    expect(this.credentials.username).toBeTruthy();
    expect(this.credentials.password).toBeTruthy();
});

When('realizo el login con las credenciales obtenidas', async function (this: World) {
    if (!this.loginPage || !this.credentials) {
        throw new Error('LoginPage or credentials are not initialized');
    }
    
    await this.loginPage.login(this.credentials.username, this.credentials.password);
});

Then('debo estar en la página de productos', async function (this: World) {
    if (!this.page) {
        throw new Error('Page is not initialized');
    }
    
    await expect(this.page).toHaveURL(/.*inventory.*/, { timeout: 10000 });
});

When('localizo el producto {string}', async function (this: World, productName: string) {
    if (!this.page) {
        throw new Error('Page is not initialized');
    }
    
    this.productsPage = new ProductsPage(this.page);
    this.capturedProduct = await this.productsPage.findProductByName(productName);
});

When('capturo el nombre y precio del producto', function (this: World) {
    expect(this.capturedProduct).toBeDefined();
    expect(this.capturedProduct!.name).toBeTruthy();
    expect(this.capturedProduct!.name).toContain('Fleece Jacket');
    expect(this.capturedProduct!.price).toBeTruthy();
    expect(this.capturedProduct!.price).toMatch(/\$\d+\.\d{2}/);
});

When('añado el producto al carrito de compras', async function (this: World) {
    if (!this.productsPage || !this.capturedProduct) {
        throw new Error('ProductsPage or captured product are not initialized');
    }
    
    await this.productsPage.addProductToCart(this.capturedProduct.name);
    
    // Validate that it was added to cart
    const addButton = this.page!.locator(`//a[contains(., "${this.capturedProduct.name}")]/../../..//button[contains(@class, "btn_inventory")]`);
    await expect(addButton).toHaveText(/Remove/i, { timeout: 3000 });
});

When('navego al carrito de compras', async function (this: World) {
    if (!this.productsPage) {
        throw new Error('ProductsPage is not initialized');
    }
    
    await this.productsPage.openCart();
    await expect(this.page!).toHaveURL(/.*cart.*/, { timeout: 5000 });
});

Then('debo validar que el nombre del producto en el carrito coincide con el capturado', async function (this: World) {
    if (!this.page || !this.capturedProduct) {
        throw new Error('Page or captured product are not initialized');
    }
    
    if (!this.cartPage) {
        this.cartPage = new CartPage(this.page);
    }
    const cartProduct = await this.cartPage.getCartItem(this.capturedProduct.name);
    
    expect(cartProduct.name).toBe(this.capturedProduct.name);
});

Then('debo validar que el precio del producto en el carrito coincide con el capturado', async function (this: World) {
    if (!this.cartPage || !this.capturedProduct) {
        throw new Error('CartPage or captured product are not initialized');
    }
    
    const cartProduct = await this.cartPage.getCartItem(this.capturedProduct.name);
    expect(cartProduct.price).toBe(this.capturedProduct.price);
});

When('procedo al checkout', async function (this: World) {
    if (!this.cartPage) {
        throw new Error('CartPage is not initialized');
    }
    
    await this.cartPage.proceedToCheckout();
    await expect(this.page!).toHaveURL(/.*checkout-step-one.*/, { timeout: 5000 });
});

When('completo la información de checkout con nombre {string}, apellido {string} y código postal {string}', async function (this: World, firstName: string, lastName: string, zipCode: string) {
    if (!this.page) {
        throw new Error('Page is not initialized');
    }
    
    if (!this.checkoutPage) {
        this.checkoutPage = new CheckoutPage(this.page);
    }
    await this.checkoutPage.fillCheckoutInfo(firstName, lastName, zipCode);
    
    // Validate that fields were completed
    await expect(this.page.locator('[data-test="firstName"]')).toHaveValue(firstName);
    await expect(this.page.locator('[data-test="lastName"]')).toHaveValue(lastName);
    await expect(this.page.locator('[data-test="postalCode"]')).toHaveValue(zipCode);
});

When('continúo con el checkout', async function (this: World) {
    if (!this.checkoutPage) {
        throw new Error('CheckoutPage is not initialized');
    }
    
    await this.checkoutPage.continueCheckout();
    await expect(this.page!).toHaveURL(/.*checkout-step-two.*/, { timeout: 5000 });
});

When('finalizo la orden', async function (this: World) {
    if (!this.checkoutPage) {
        throw new Error('CheckoutPage is not initialized');
    }
    
    await this.checkoutPage.finishOrder();
    await expect(this.page!).toHaveURL(/.*checkout-complete.*/, { timeout: 5000 });
});

Then('debo recibir un mensaje de confirmación que contenga {string}', async function (this: World, expectedText: string) {
    if (!this.checkoutPage) {
        throw new Error('CheckoutPage is not initialized');
    }
    
    this.confirmationMessage = await this.checkoutPage.getOrderConfirmationMessage();
    expect(this.confirmationMessage).toBeTruthy();
    expect(this.confirmationMessage).toContain(expectedText);
});

Then('debo estar en la página de confirmación de orden', function (this: World) {
    // This validation was already done in the previous step
    expect(this.page!.url()).toContain('checkout-complete');
});
