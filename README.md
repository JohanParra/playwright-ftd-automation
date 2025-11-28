# Proyecto de Automatización - Playwright con TypeScript

Este proyecto contiene pruebas automatizadas desarrolladas con Playwright y TypeScript para cumplir con los criterios de la prueba técnica de automatización de Farmatodo S.A.S.

## 📋 Descripción

El proyecto incluye:
- **Pruebas de Integración**: Pruebas contra la API pública de PokéAPI para obtener y ordenar cadenas de evolución de Pokémon
- **Pruebas E2E**: Pruebas end-to-end del flujo completo de compra en Sauce Demo
- **Integración con Cucumber**: Scenarios escritos en Gherkin con palabras clave en inglés y descripciones en español

## 🚀 Requisitos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)

## 📦 Instalación

### Paso 1: Clonar el repositorio
```bash
git clone git@github.com:JohanParra/playwright-ftd-automation.git
cd playwright-ftd-automation
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Instalar navegadores de Playwright
```bash
npx playwright install
```

## 🚀 Ejecución del Proyecto

### Método Recomendado: Ejecutar con Cucumber (BDD)

**Para ver los logs más amigables y formateados en consola, se recomienda ejecutar las pruebas con Cucumber:**

```bash
npm run test:cucumber
```

Este comando ejecuta todas las pruebas (E2E e integración) y muestra una salida formateada y colorizada en consola con:
- ✅ Símbolos visuales para cada step ejecutado
- Descripción completa de cada paso en español
- Mensajes de consola personalizados (como listados de Pokémon ordenados)
- Resumen final con estadísticas de ejecución

**Ejemplo de salida:**
```
Feature: Flujo de Compra E2E en Sauce Demo

  @e2e @shopping
  Scenario: Completar flujo de compra completo desde login hasta confirmación
    ✔ Given navego a la página de Sauce Demo
    ✔ When obtengo las credenciales de la página
    ✔ And realizo el login con las credenciales obtenidas
    ...
```

### Ejecutar pruebas específicas con Cucumber

**Solo pruebas E2E:**
```bash
npm run test:cucumber:e2e
```

**Solo pruebas de integración:**
```bash
npm run test:cucumber:integration
```

### Método Alternativo: Ejecutar con Playwright (estilo tradicional)

Si prefieres ejecutar las pruebas con Playwright directamente:

```bash
# Todas las pruebas
npm test

# Solo E2E
npm run test:e2e

# Solo integración
npm run test:integration
```

## 🏗️ Estructura del Proyecto

```
playwright-ftd-automation/
├── src/
│   ├── api/
│   │   └── pokemon.api.ts          # Cliente API para PokéAPI
│   ├── e2e/
│   │   └── pages/
│   │       ├── loginPage.ts        # Page Object para login
│   │       ├── productsPage.ts      # Page Object para productos
│   │       ├── cartPage.ts          # Page Object para carrito
│   │       └── checkoutPage.ts     # Page Object para checkout
│   ├── steps/
│   │   ├── pokemon.steps.ts        # Step definitions para Pokemon (Cucumber)
│   │   └── shopping.steps.ts       # Step definitions para Shopping (Cucumber)
│   └── support/
│       └── world.ts                 # World object para Cucumber (comparte contexto)
├── tests/
│   ├── e2e/
│   │   └── shopping-flow.spec.ts   # Test E2E de flujo de compra (Playwright)
│   └── integration/
│       └── pokemon-evolution.spec.ts # Test de integración con API (Playwright)
├── features/
│   ├── e2e/
│   │   └── shopping-flow.feature    # Feature Gherkin para E2E
│   └── integration/
│       └── pokemon-evolution.feature # Feature Gherkin para integración
├── playwright.config.ts             # Configuración de Playwright
├── cucumber.js                      # Configuración de Cucumber
├── package.json
└── tsconfig.json
```

### Formato de Features (Gherkin)

Los archivos `.feature` utilizan:
- **Palabras clave en inglés**: `Given`, `When`, `Then`, `And` (estándar de Gherkin)
- **Descripciones en español**: Todos los steps están escritos en español para mejor legibilidad

**Ejemplo:**
```gherkin
Given navego a la página de Sauce Demo
When obtengo las credenciales de la página
And realizo el login con las credenciales obtenidas
Then debo estar en la página de productos
```

## 📊 Reportes

### Reportes de Playwright

**Ver reporte HTML de Playwright:**
```bash
npm run report
```
Abre el reporte HTML interactivo que se genera automáticamente después de ejecutar los tests.

**Ubicación de reportes de Playwright:**
- **Reporte HTML**: `playwright-report/index.html` (se genera automáticamente)
- **Reporte JSON**: `test-results/results.json`
- **Screenshots**: `reports/screenshots/` (solo en fallos)
- **Videos**: `test-results/` (solo en fallos, si están habilitados)

### Reportes de Cucumber

**Salida en consola:**
Los tests con Cucumber muestran una salida formateada y colorizada usando `@cucumber/pretty-formatter`:
- ✅ Símbolos de check para steps exitosos
- Nombre del Feature y Scenario
- Descripción completa de cada step con su ubicación
- Mensajes de consola personalizados (como listados de Pokémon ordenados)

**Ejemplo de salida:**
```
Feature: Cadena de Evolución de Pokémon

  @integration @pokemon
  Scenario: Obtener cadena de evolución de Squirtle y ordenarla alfabéticamente
    ✔ Given tengo acceso a la API de PokéAPI
    ✔ When solicito la cadena de evolución del Pokémon "squirtle"
    ✔ Then la API debe responder con código 200
    ...
```

**Reporte JSON:**
- **Ubicación**: `reports/cucumber-report.json`
- Formato JSON con todos los detalles de la ejecución
- Útil para integración con herramientas CI/CD

**Nota**: Actualmente solo se genera el reporte JSON. El reporte HTML de Cucumber requiere configuración adicional si se desea.

## ✅ Criterios de Aceptación Cumplidos

### Prueba de Integración - PokéAPI

✅ **Las APIs responden código 200 en cada solicitud**
- Se valida explícitamente el código de estado 200 en cada llamada API usando `expect()` de Playwright
- Validaciones en: `getPokemonByName()`, `getSpecies()`, y `getEvolutionChain()`
- Cada método retorna el `statusCode` para validación explícita

✅ **Se extraen correctamente los nombres de los Pokémon en la evolución**
- Se extraen todos los nombres de la cadena de evolución recursivamente
- Se valida que contenga los Pokémon esperados: squirtle, wartortle, blastoise
- Validación explícita de que todos los nombres están presentes

✅ **La lista de nombres se ordena alfabéticamente sin utilizar métodos de ordenamiento nativos**
- Implementado algoritmo Bubble Sort personalizado en el método `sortAlphabetically()`
- No se utiliza `.sort()` ni ningún otro método nativo de ordenamiento
- Validación explícita del ordenamiento alfabético

✅ **Se imprimen los nombres ordenados correctamente con su peso en la salida**
- Se imprime cada Pokémon con su nombre y peso ordenados alfabéticamente
- Formato: `{número}. {nombre} - Peso: {peso} kg`
- Salida visible tanto en consola como en reportes

### Prueba E2E - Sauce Demo

✅ **Ingresar al enlace de la página de prueba**
- Navegación automática a `https://www.saucedemo.com`
- Configuración de `baseURL` en Playwright y Cucumber World

✅ **Realizar el Login**
- Extracción automática de credenciales desde la página usando `getCredentials()`
- Login exitoso con validación de navegación
- Manejo de errores descriptivo

✅ **Localizar el producto "Sauce Labs Fleece Jacket"**
- Búsqueda del producto por nombre usando Page Object Model
- Validación de existencia del producto
- Manejo de errores si el producto no se encuentra

✅ **Almacenar el nombre del artículo y su precio**
- Captura del nombre completo del producto
- Captura del precio con validación de formato (`$XX.XX`)
- Almacenamiento para validaciones posteriores

✅ **Añadir el producto al carrito de compras**
- Clic en botón "Add to cart"
- Validación de cambio de estado del botón (cambia a "Remove")
- Confirmación visual de que se añadió al carrito

✅ **Validar que nombre y precio coinciden en el carrito**
- Comparación explícita del nombre capturado vs nombre en carrito
- Comparación explícita del precio capturado vs precio en carrito
- Validaciones con mensajes descriptivos en caso de fallo

✅ **Completar el proceso de compra hasta confirmación**
- Completar información de checkout (nombre, apellido, código postal)
- Validación de campos completados
- Finalizar orden
- Validar mensaje de confirmación que contiene "Thank you"

## 🛠️ Tecnologías Utilizadas

- **Playwright** (^1.57.0): Framework de automatización de pruebas
- **TypeScript** (^5.9.3): Lenguaje de programación tipado
- **Cucumber** (^10.3.1): Framework BDD para scenarios en Gherkin
- **@cucumber/pretty-formatter** (^2.4.1): Formatter para salida formateada en consola
- **Axios** (^1.13.2): Cliente HTTP para llamadas a API
- **PokéAPI**: API pública para datos de Pokémon
- **Sauce Demo**: Aplicación de prueba para E2E

## 🔍 Validaciones Implementadas

### Prueba de Integración
- ✅ Validación de código de estado HTTP 200 en cada llamada API
- ✅ Validación de nombres de Pokémon esperados (squirtle, wartortle, blastoise)
- ✅ Validación de pesos mayores a 0
- ✅ Validación de ordenamiento alfabético correcto
- ✅ Impresión de resultados ordenados con formato legible

### Prueba E2E
- ✅ Validación de navegación entre páginas (URLs)
- ✅ Validación de elementos visibles y habilitados
- ✅ Validación de datos capturados vs datos en carrito
- ✅ Validación de formularios completados (valores ingresados)
- ✅ Validación de mensajes de confirmación
- ✅ Validación de formato de precios
