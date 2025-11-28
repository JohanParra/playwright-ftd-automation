@integration @pokemon
Feature: Cadena de Evolución de Pokémon
  Como QA Automation Engineer
  Quiero obtener la cadena de evoluciones de Squirtle desde la API de PokéAPI
  Para validar que se extraen correctamente los nombres y pesos, y se ordenan alfabéticamente

  Scenario: Obtener cadena de evolución de Squirtle y ordenarla alfabéticamente
    Given tengo acceso a la API de PokéAPI
    When solicito la cadena de evolución del Pokémon "squirtle"
    Then la API debe responder con código 200
    And debo obtener los datos básicos de Squirtle con código 200
    And debo obtener la información de la especie con código 200
    And debo obtener la cadena de evolución completa con código 200
    And debo extraer los nombres de los Pokémon en la evolución
    And debo extraer el peso de cada Pokémon en la evolución
    And debo ordenar los nombres alfabéticamente sin usar métodos nativos
    And debo imprimir los nombres ordenados con su peso
    And la lista debe contener "squirtle", "wartortle" y "blastoise"
    And todos los Pokémon deben tener peso mayor a 0
    And los nombres deben estar ordenados alfabéticamente
