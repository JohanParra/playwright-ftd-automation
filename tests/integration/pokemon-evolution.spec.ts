import { test, expect } from '@playwright/test';
import { PokemonAPI } from '../../src/api/pokemon.api';

test.describe('Pokemon Evolution API Tests', () => {
    let pokemonAPI: PokemonAPI;

    test.beforeEach(() => {
        pokemonAPI = new PokemonAPI();
    });

    test('Should get Squirtle evolution chain with names and weights sorted alphabetically', async () => {
        // Step 1: Obtener datos básicos de Squirtle y validar código 200
        const squirtleData = await pokemonAPI.getPokemonByName('squirtle');
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(squirtleData.statusCode).toBe(200);
        expect(squirtleData.name).toBe('squirtle');
        expect(squirtleData.weight).toBeGreaterThan(0);

        // Step 2: Obtener información de la especie y validar código 200
        const speciesData = await pokemonAPI.getSpecies(squirtleData.speciesUrl);
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(speciesData.statusCode).toBe(200);
        expect(speciesData.name).toBe('squirtle');
        expect(speciesData.evolutionChainUrl).toBeTruthy();

        // Step 3: Extraer cadena de evolución completa con nombres y pesos y validar código 200
        const evolutionResponse = await pokemonAPI.getEvolutionChain(
            speciesData.evolutionChainUrl
        );
        
        // Validación explícita de código 200 según criterios de aceptación
        expect(evolutionResponse.statusCode).toBe(200);
        const evolutionData = evolutionResponse.data;
        expect(evolutionData.length).toBeGreaterThan(0);

        // Step 4: Ordenar alfabéticamente sin usar método .sort()
        const sortedEvolution = pokemonAPI.sortAlphabetically(evolutionData);
        expect(sortedEvolution.length).toBe(evolutionData.length);

        // Step 5: Validaciones según criterios de aceptación
        // Validar que contiene los Pokémon esperados
        const names = sortedEvolution.map(p => p.name);
        expect(names).toContain('squirtle');
        expect(names).toContain('wartortle');
        expect(names).toContain('blastoise');
        expect(names.length).toBe(3);

        // Validar que todos tienen pesos válidos
        sortedEvolution.forEach((pokemon, index) => {
            expect(pokemon.weight).toBeGreaterThan(0);
            expect(pokemon.name).toBeTruthy();
        });

        // Validar orden alfabético explícitamente
        for (let i = 0; i < sortedEvolution.length - 1; i++) {
            const currentName = sortedEvolution[i].name.toLowerCase();
            const nextName = sortedEvolution[i + 1].name.toLowerCase();
            expect(currentName <= nextName).toBeTruthy();
        }
    });
});
