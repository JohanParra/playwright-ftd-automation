import axios from 'axios';

const API_BASE = 'https://pokeapi.co/api/v2';

export class PokemonAPI {
    private client = axios.create({
        baseURL: API_BASE,
        timeout: 10000,
    });

    async getPokemonByName(name: string) {
        const response = await this.client.get(`/pokemon/${name}`);

        if (response.status !== 200) {
            throw new Error(`API error: ${response.status}`);
        }

        return {
            name: response.data.name,
            weight: response.data.weight,
            speciesUrl: response.data.species.url,
        };
    }

    async getSpecies(url: string) {
        const response = await this.client.get(url);

        if (response.status !== 200) {
            throw new Error(`API error: ${response.status}`);
        }

        return {
            name: response.data.name,
            weight: response.data.weight,
            evolutionChainUrl: response.data.evolution_chain.url,
        };
    }

    async getEvolutionChain(url: string): Promise<{ name: string; weight: number }[]> {
        const response = await this.client.get(url);

        if (response.status !== 200) {
            throw new Error(`API error: ${response.status}`);
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

        // Retornar array de objetos con nombre y peso
        return names.map(name => ({
            name,
            weight: weights[name] || 0
        }));
    }

    sortAlphabetically(items: { name: string; weight: number }[]): { name: string; weight: number }[] {
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