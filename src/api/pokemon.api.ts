import axios, { AxiosResponse } from 'axios';

const API_BASE = 'https://pokeapi.co/api/v2';

/**
 * Interfaz para los datos de un Pokémon
 */
export interface PokemonData {
    name: string;
    weight: number;
    speciesUrl: string;
    statusCode?: number;
}

/**
 * Interfaz para los datos de una especie
 */
export interface SpeciesData {
    name: string;
    weight: number;
    evolutionChainUrl: string;
    statusCode?: number;
}

/**
 * Interfaz para los datos de evolución
 */
export interface EvolutionData {
    name: string;
    weight: number;
}

/**
 * Clase para interactuar con la API de PokéAPI
 * Proporciona métodos para obtener información de Pokémon y sus evoluciones
 */
export class PokemonAPI {
    private client = axios.create({
        baseURL: API_BASE,
        timeout: 10000,
    });

    /**
     * Obtiene los datos básicos de un Pokémon por su nombre
     * @param name - Nombre del Pokémon
     * @returns Datos del Pokémon incluyendo nombre, peso y URL de especie
     * @throws Error si la API no responde con código 200
     */
    async getPokemonByName(name: string): Promise<PokemonData> {
        try {
            const response: AxiosResponse = await this.client.get(`/pokemon/${name}`);

            if (response.status !== 200) {
                throw new Error(`Error en API: La solicitud retornó código ${response.status} en lugar de 200`);
            }

            return {
                name: response.data.name,
                weight: response.data.weight,
                speciesUrl: response.data.species.url,
                statusCode: response.status,
            };
        } catch (error: any) {
            if (error.response) {
                throw new Error(`Error al obtener Pokémon '${name}': La API respondió con código ${error.response.status}`);
            }
            throw new Error(`Error al obtener Pokémon '${name}': ${error.message}`);
        }
    }

    /**
     * Obtiene información de una especie de Pokémon
     * @param url - URL de la especie
     * @returns Datos de la especie incluyendo nombre, peso y URL de cadena de evolución
     * @throws Error si la API no responde con código 200
     */
    async getSpecies(url: string): Promise<SpeciesData> {
        try {
            const response: AxiosResponse = await this.client.get(url);

            if (response.status !== 200) {
                throw new Error(`Error en API: La solicitud retornó código ${response.status} en lugar de 200`);
            }

            return {
                name: response.data.name,
                weight: response.data.weight,
                evolutionChainUrl: response.data.evolution_chain.url,
                statusCode: response.status,
            };
        } catch (error: any) {
            if (error.response) {
                throw new Error(`Error al obtener especie desde '${url}': La API respondió con código ${error.response.status}`);
            }
            throw new Error(`Error al obtener especie desde '${url}': ${error.message}`);
        }
    }

    /**
     * Obtiene la cadena de evolución completa de un Pokémon
     * @param url - URL de la cadena de evolución
     * @returns Array de objetos con nombre y peso de cada Pokémon en la cadena de evolución
     * @throws Error si la API no responde con código 200
     */
    async getEvolutionChain(url: string): Promise<{ data: EvolutionData[]; statusCode: number }> {
        try {
            const response: AxiosResponse = await this.client.get(url);

            if (response.status !== 200) {
                throw new Error(`Error en API: La solicitud retornó código ${response.status} en lugar de 200`);
            }

        const names: string[] = [];
        const weights: Record<string, number> = {};

        // Función recursiva para extraer evoluciones
        const traverseChain = async (chain: any) => {
            const speciesName = chain.species.name;
            names.push(speciesName);

            // Obtener datos del Pokémon específico para el peso
            try {
                const pokemon = await this.getPokemonByName(speciesName);
                weights[speciesName] = pokemon.weight;
            } catch (error) {
                console.log(`[Error] No se pudo obtener el peso para ${speciesName}`);
            }

            // Procesar evoluciones siguientes
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                for (const evolution of chain.evolves_to) {
                    await traverseChain(evolution);
                }
            }
        };

            await traverseChain(response.data.chain);

            // Retornar array de objetos con nombre y peso junto con el código de estado
            return {
                data: names.map(name => ({
                    name,
                    weight: weights[name] || 0
                })),
                statusCode: response.status,
            };
        } catch (error: any) {
            if (error.response) {
                throw new Error(`Error al obtener cadena de evolución desde '${url}': La API respondió con código ${error.response.status}`);
            }
            throw new Error(`Error al obtener cadena de evolución desde '${url}': ${error.message}`);
        }
    }

    /**
     * Ordena un array de objetos alfabéticamente por nombre sin usar métodos nativos de ordenamiento
     * Implementa el algoritmo Bubble Sort
     * @param items - Array de objetos con nombre y peso
     * @returns Array ordenado alfabéticamente por nombre
     */
    sortAlphabetically(items: EvolutionData[]): EvolutionData[] {
        const sorted = [...items];

        for (let i = 0; i < sorted.length; i++) {
            for (let j = 0; j < sorted.length - 1 - i; j++) {
                // Comparar por nombre (propiedad 'name')
                if (sorted[j].name > sorted[j + 1].name) {
                    [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
                }
            }
        }

        return sorted;
    }
}