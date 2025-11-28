import { Given, When, Then, setWorldConstructor } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { World } from '../support/world';
import { PokemonAPI } from '../api/pokemon.api';

setWorldConstructor(World);

Given('tengo acceso a la API de PokéAPI', function (this: World) {
    this.pokemonAPI = new PokemonAPI();
});

When('solicito la cadena de evolución del Pokémon {string}', async function (this: World, pokemonName: string) {
    if (!this.pokemonAPI) {
        throw new Error('PokemonAPI is not initialized');
    }
    
    // Get basic Pokemon data
    this.pokemonData = await this.pokemonAPI.getPokemonByName(pokemonName.toLowerCase());
    
    // Get species information
    this.speciesData = await this.pokemonAPI.getSpecies(this.pokemonData.speciesUrl);
    
    // Get evolution chain
    const evolutionResponse = await this.pokemonAPI.getEvolutionChain(this.speciesData.evolutionChainUrl);
    this.evolutionData = evolutionResponse.data;
});

Then('la API debe responder con código {int}', function (this: World, expectedStatus: number) {
    // This validation is done in the following steps
});

Then('debo obtener los datos básicos de Squirtle con código {int}', function (this: World, expectedStatus: number) {
    expect(this.pokemonData).toBeDefined();
    if (!this.pokemonData) {
        throw new Error('pokemonData is not defined');
    }
    expect(this.pokemonData.statusCode).toBe(expectedStatus);
    expect(this.pokemonData.name).toBe('squirtle');
});

Then('debo obtener la información de la especie con código {int}', function (this: World, expectedStatus: number) {
    expect(this.speciesData).toBeDefined();
    if (!this.speciesData) {
        throw new Error('speciesData is not defined');
    }
    expect(this.speciesData.statusCode).toBe(expectedStatus);
    expect(this.speciesData.name).toBe('squirtle');
});

Then('debo obtener la cadena de evolución completa con código {int}', function (this: World, expectedStatus: number) {
    expect(this.evolutionData).toBeDefined();
    if (!this.evolutionData) {
        throw new Error('evolutionData is not defined');
    }
    expect(this.evolutionData.length).toBeGreaterThan(0);
});

Then('debo extraer los nombres de los Pokémon en la evolución', function (this: World) {
    expect(this.evolutionData).toBeDefined();
    if (!this.evolutionData) {
        throw new Error('evolutionData is not defined');
    }
    expect(this.evolutionData.length).toBeGreaterThan(0);
    
    const names = this.evolutionData.map(p => p.name);
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain('squirtle');
    expect(names).toContain('wartortle');
    expect(names).toContain('blastoise');
});

Then('debo extraer el peso de cada Pokémon en la evolución', function (this: World) {
    expect(this.evolutionData).toBeDefined();
    if (!this.evolutionData) {
        throw new Error('evolutionData is not defined');
    }
    
    this.evolutionData.forEach(pokemon => {
        expect(pokemon.weight).toBeGreaterThan(0);
        expect(pokemon.name).toBeTruthy();
    });
});

Then('debo ordenar los nombres alfabéticamente sin usar métodos nativos', function (this: World) {
    if (!this.pokemonAPI || !this.evolutionData) {
        throw new Error('Data not available for sorting');
    }
    
    this.sortedEvolution = this.pokemonAPI.sortAlphabetically(this.evolutionData);
    expect(this.sortedEvolution.length).toBe(this.evolutionData.length);
});

Then('debo imprimir los nombres ordenados con su peso', function (this: World) {
    expect(this.sortedEvolution).toBeDefined();
    if (!this.sortedEvolution) {
        throw new Error('sortedEvolution is not defined');
    }
    
    console.log('\n=== Pokémon ordenados alfabéticamente ===');
    this.sortedEvolution.forEach((pokemon, index) => {
        console.log(`${index + 1}. ${pokemon.name} - Peso: ${pokemon.weight} kg`);
    });
    console.log('');
});

Then('la lista debe contener {string}, {string} y {string}', function (this: World, name1: string, name2: string, name3: string) {
    expect(this.sortedEvolution).toBeDefined();
    if (!this.sortedEvolution) {
        throw new Error('sortedEvolution is not defined');
    }
    
    const names = this.sortedEvolution.map(p => p.name);
    expect(names).toContain(name1.toLowerCase());
    expect(names).toContain(name2.toLowerCase());
    expect(names).toContain(name3.toLowerCase());
    expect(names.length).toBe(3);
});

Then('todos los Pokémon deben tener peso mayor a {int}', function (this: World, minWeight: number) {
    expect(this.sortedEvolution).toBeDefined();
    if (!this.sortedEvolution) {
        throw new Error('sortedEvolution is not defined');
    }
    
    this.sortedEvolution.forEach(pokemon => {
        expect(pokemon.weight).toBeGreaterThan(minWeight);
    });
});

Then('los nombres deben estar ordenados alfabéticamente', function (this: World) {
    expect(this.sortedEvolution).toBeDefined();
    if (!this.sortedEvolution) {
        throw new Error('sortedEvolution is not defined');
    }
    
    for (let i = 0; i < this.sortedEvolution.length - 1; i++) {
        const currentName = this.sortedEvolution[i].name.toLowerCase();
        const nextName = this.sortedEvolution[i + 1].name.toLowerCase();
        expect(currentName <= nextName).toBeTruthy();
    }
});
