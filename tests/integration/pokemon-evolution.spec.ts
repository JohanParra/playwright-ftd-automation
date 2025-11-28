import { test, expect } from '@playwright/test';
import { PokemonAPI } from '../../src/api/pokemon.api';

test.describe('Pokemon Evolution API Tests', () => {
    let pokemonAPI: PokemonAPI;

    test.beforeEach(() => {
        pokemonAPI = new PokemonAPI();
    });

    test('Should get Squirtle evolution chain with names and weights sorted alphabetically', async () => {
        console.log('\n=== INICIO: Prueba de cadena de evolución de Squirtle ===\n');

        // Step 1: Obtener datos básicos de Squirtle y validar código 200
        console.log('[Step 1] Obteniendo datos básicos del Pokémon Squirtle...');
        const squirtleData = await pokemonAPI.getPokemonByName('squirtle');
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(squirtleData.statusCode).toBe(200);
        expect(squirtleData.name).toBe('squirtle');
        expect(squirtleData.weight).toBeGreaterThan(0);
        console.log(`[Step 1] ✅ Completada - Status: ${squirtleData.statusCode}, Nombre: ${squirtleData.name}, Peso: ${squirtleData.weight} kg\n`);

        // Step 2: Obtener información de la especie y validar código 200
        console.log('[Step 2] Obteniendo información de la especie...');
        const speciesData = await pokemonAPI.getSpecies(squirtleData.speciesUrl);
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(speciesData.statusCode).toBe(200);
        expect(speciesData.name).toBe('squirtle');
        expect(speciesData.evolutionChainUrl).toBeTruthy();
        console.log(`[Step 2] ✅ Completada - Status: ${speciesData.statusCode}, Especie: ${speciesData.name}\n`);

        // Step 3: Extraer cadena de evolución completa con nombres y pesos y validar código 200
        console.log('[Step 3] Extrayendo cadena de evolución completa...');
        const evolutionResponse = await pokemonAPI.getEvolutionChain(
            speciesData.evolutionChainUrl
        );
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(evolutionResponse.statusCode).toBe(200);
        const evolutionData = evolutionResponse.data;
        expect(evolutionData.length).toBeGreaterThan(0);
        
        console.log(`[Step 3] ✅ Completada - Status: ${evolutionResponse.statusCode}, Se encontraron ${evolutionData.length} Pokémon en la cadena de evolución`);
        console.log('[Step 3] Datos extraídos (orden original):');
        evolutionData.forEach((pokemon, index) => {
            console.log(`  ${index + 1}. ${pokemon.name} - Peso: ${pokemon.weight} kg`);
        });
        console.log('');

        // Step 4: Ordenar alfabéticamente sin usar método .sort()
        console.log('[Step 4] Ordenando alfabéticamente usando algoritmo personalizado (Bubble Sort)...');
        const sortedEvolution = pokemonAPI.sortAlphabetically(evolutionData);
        expect(sortedEvolution.length).toBe(evolutionData.length);
        console.log('[Step 4] ✅ Completada - Ordenamiento alfabético aplicado');
        console.log('[Step 4] Resultado ordenado:');
        sortedEvolution.forEach((pokemon, index) => {
            console.log(`  ${index + 1}. ${pokemon.name} - Peso: ${pokemon.weight} kg`);
        });
        console.log('');

        // Step 5: Validaciones según criterios de aceptación
        console.log('[Step 5] Ejecutando validaciones según criterios de aceptación...');

        // Validar que contiene los Pokémon esperados
        const names = sortedEvolution.map(p => p.name);
        expect(names).toContain('squirtle');
        expect(names).toContain('wartortle');
        expect(names).toContain('blastoise');
        expect(names.length).toBe(3);
        console.log('[Step 5] ✅ Validación de nombres: OK - Todos los Pokémon esperados están presentes');

        // Validar que todos tienen pesos válidos
        sortedEvolution.forEach((pokemon, index) => {
            expect(pokemon.weight).toBeGreaterThan(0);
            expect(pokemon.name).toBeTruthy();
        });
        console.log('[Step 5] ✅ Validación de pesos: OK - Todos los Pokémon tienen peso mayor a 0');

        // Validar orden alfabético explícitamente
        for (let i = 0; i < sortedEvolution.length - 1; i++) {
            const currentName = sortedEvolution[i].name.toLowerCase();
            const nextName = sortedEvolution[i + 1].name.toLowerCase();
            expect(currentName <= nextName).toBeTruthy();
        }
        console.log('[Step 5] ✅ Validación de orden alfabético: OK - Los elementos están ordenados correctamente');
        console.log('');

        console.log('=== FIN: Prueba completada exitosamente ===\n');
    });
});
