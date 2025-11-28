@e2e @shopping
Feature: Flujo de Compra E2E en Sauce Demo
  Como usuario de Sauce Demo
  Quiero completar un flujo de compra completo
  Para validar que el proceso funciona correctamente desde login hasta confirmación

  Scenario: Completar flujo de compra completo desde login hasta confirmación
    Given navego a la página de Sauce Demo
    When obtengo las credenciales de la página
    And realizo el login con las credenciales obtenidas
    Then debo estar en la página de productos
    When localizo el producto "Sauce Labs Fleece Jacket"
    And capturo el nombre y precio del producto
    And añado el producto al carrito de compras
    And navego al carrito de compras
    Then debo validar que el nombre del producto en el carrito coincide con el capturado
    And debo validar que el precio del producto en el carrito coincide con el capturado
    When procedo al checkout
    And completo la información de checkout con nombre "Juan", apellido "Pérez" y código postal "080001"
    And continúo con el checkout
    And finalizo la orden
    Then debo recibir un mensaje de confirmación que contenga "Thank you"
    And debo estar en la página de confirmación de orden
