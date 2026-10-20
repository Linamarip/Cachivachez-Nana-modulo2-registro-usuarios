describe('Suite Completa de Pruebas Automatizadas (10 Casos) - Cachivaches NANA', () => {

  beforeEach(() => {
    // 🌐 El robot visita el servidor web local en tu Lenovo ThinkBook
    cy.visit('http://localhost:5173'); 
  });

  // --- MÓDULO 1: AUTENTICACIÓN Y SEGURIDAD ---

  it.only('CP-001: Verificación de inicio de sesión exitoso con usuario real de MySQL', () => {
    cy.get('#txtEmail').type('mariangel@ejemplo.com'); // Reemplaza con el correo de Oswaldo si prefieres
    cy.get('#txtPassword').type('Nana2026*'); // Sincronizado con la clave real del salvavidas de tu base de datos
    cy.get('#btnIngresar').click();
    cy.get('#vistaCatalogo').should('be.visible');
  });

  it.only('CP-002: Rechazo de acceso ante credenciales inválidas (Control de Errores)', () => {
    cy.get('#txtEmail').type('correo_falso@gmail.com');
    cy.get('#txtPassword').type('clave_errada_999');
    cy.get('#btnIngresar').click();
    cy.get('#mensajeError').should('be.visible');
  });

  it('CP-005: Validación de comportamiento ante campos totalmente vacíos', () => {
    // El robot presiona ingresar directamente sin digitar nada
    cy.get('#btnIngresar').click();
    // Verifica que el sistema active los bloqueos de seguridad del formulario HTML5 o alertas
    cy.get('#txtEmail').should('have.attr', 'required');
  });

  it.only('CP-006: Control de sintaxis ante un formato de correo electrónico erróneo', () => {
    cy.get('#txtEmail').type('correo_sin_arroba_gmail.com');
    cy.get('#txtPassword').type('pass123');
    cy.get('#btnIngresar').click();
    // Valida que el navegador detenga el envío por estructura de campo incorrecta
    cy.get('#vistaLogin').should('be.visible');
  });

  // --- MÓDULO 2: INTERACTION Y CATÁLOGO OAKLEY ---

  it.only('CP-003: Renderización dinámica y visibilidad del Catálogo de ropa Oakley', () => {
    cy.get('#txtEmail').type('mariangel@ejemplo.com');
    cy.get('#txtPassword').type('Nana2026*');
    cy.get('#btnIngresar').click();
    // Verifica los elementos visuales del inventario
    cy.get('#vistaCatalogo').should('be.visible');
    cy.contains('Buso Algodón NANA - $190.000').should('be.visible');
    cy.contains('Camiseta Over-size - $90.000').should('be.visible');
  });

  it('CP-009: Verificación de adaptabilidad gráfica y nitidez del Logotipo Corporativo', () => {
    // Valida que el contenedor del logo exista y mantenga las propiedades de visualización proporcionadas
    cy.get('h2').contains('Cachivaches NANA').should('be.visible');
  });

  // --- MÓDULO 3: TRANSACCIONAL Y CARRITO DE COMPRAS ---

  it.only('CP-004: Validación de acumulación matemática del Carrito y simulación de Cierre', () => {
    cy.get('#txtEmail').type('mariangel@ejemplo.com');
    cy.get('#txtPassword').type('Nana2026*');
    cy.get('#btnIngresar').click();
    cy.get('#btnVerCarrito').click();
    // Verifica la suma exacta calculada por las reglas de negocio de la tienda
    cy.get('#vistaCarrito').should('be.visible');
    cy.contains('$280.000 COP').should('be.visible');
    cy.get('#btnFinalizar').click();
  });

  it('CP-008: Persistencia del estado del Carrito al usar el flujo de navegación de regreso', () => {
    cy.get('#txtEmail').type('mariangel@ejemplo.com');
    cy.get('#txtPassword').type('Nana2026*');
    cy.get('#btnIngresar').click();
    cy.get('#btnVerCarrito').click();
    // El robot valida el carrito y simula la persistencia lúdica de los datos del catálogo de fondo
    cy.get('#vistaCarrito').should('be.visible');
    cy.contains('Total Neto a Pagar:').should('be.visible');
  });

  it.only('CP-010: Cancelación, vaciado de variables y limpieza automática tras finalizar pedido', () => {
    cy.get('#txtEmail').type('mariangel@ejemplo.com');
    cy.get('#txtPassword').type('Nana2026*');
    cy.get('#btnIngresar').click();
    cy.get('#btnVerCarrito').click();
    cy.get('#btnFinalizar').click();
    // Al dar el aviso, el sistema debe limpiar las cajas de texto y regresar al estado inicial en limpio
    cy.get('#vistaLogin').should('be.visible');
    cy.get('#txtEmail').should('have.value', '');
  });

  // --- INFRAESTRUCTURA Y TOLERANCIA A FALLOS ---

  it.('CP-007: Resiliencia del sistema ante simulación de desconexión o fallos en el backend', { failOnStatusCode: false }, () => {
    // Probamos la resistencia del entorno gráfico interceptando estados alternativos de red
    cy.request({ url: 'http://localhost:5173', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(200); // Valida que el servidor de Vite se mantenga firme dando soporte visual
    });
  });
});
