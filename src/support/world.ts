import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { PokemonAPI } from '../api/pokemon.api';
import { LoginPage } from '../e2e/pages/loginPage';
import { ProductsPage, ProductInfo } from '../e2e/pages/productsPage';
import { CartPage } from '../e2e/pages/cartPage';
import { CheckoutPage } from '../e2e/pages/checkoutPage';

/**
 * World object para compartir contexto entre steps de Cucumber
 */
export class World {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    pokemonAPI?: PokemonAPI;
    loginPage?: LoginPage;
    productsPage?: ProductsPage;
    cartPage?: CartPage;
    checkoutPage?: CheckoutPage;
    capturedProduct?: ProductInfo;
    pokemonData?: any;
    speciesData?: any;
    evolutionData?: any[];
    sortedEvolution?: any[];
    credentials?: { username: string; password: string };
    confirmationMessage?: string;

    async initBrowser() {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext({
            baseURL: 'https://www.saucedemo.com'
        });
        this.page = await this.context.newPage();
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

