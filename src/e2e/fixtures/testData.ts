/**
 * Datos de prueba para los tests E2E
 */

export const testUsers = {
    standard: {
        username: 'standard_user',
        password: 'secret_sauce',
    },
    locked: {
        username: 'locked_out_user',
        password: 'secret_sauce',
    },
    problem: {
        username: 'problem_user',
        password: 'secret_sauce',
    },
    performance: {
        username: 'performance_glitch_user',
        password: 'secret_sauce',
    },
};

export const checkoutData = {
    valid: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345',
    },
    invalid: {
        firstName: '',
        lastName: '',
        postalCode: '',
    },
};

export const productNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

