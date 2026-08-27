describe('Pruebas Automatizadas E2E - Tienda Virtual Cachivaches NANA', () => {

  beforeEach(() => {
    // 🌐 1. El robot visita tu servidor local en la Lenovo ThinkBook
    cy.visit('http://localhost:8080'); 
  });

  it('CP-001: Verificación de inicio de sesión con credenciales válidas y navegación al Catálogo', () => {
    // 📧 Digita el correo electrónico real precargado en phpMyAdmin
    cy.get('#txtEmail').type('usuario@ejemplo.com');

    // 🔑 Digita la contraseña correcta
    cy.get('#txtPassword').type('contraseña123');

    // 🔲 Hace clic en el botón morado INGRESAR
    cy.get('#btnIngresar').click();

    // 👔 CP-003: Valida que el Módulo 1 se oculte y aparezca el Catálogo Oakley
    cy.get('#vistaCatalogo').should('be.visible');
    cy.contains('Catálogo Oakley').should('be.visible');
    cy.contains('Buso Algodón NANA - $190.000').should('be.visible');
    
    // 📸 Toma captura automática del éxito del primer caso
    cy.screenshot('CP-001_Exito_Login');
  });

  it('CP-002: Rechazo de acceso ante credenciales inválidas (Control de Errores)', () => {
    // 📧 Digita un correo falso no registrado
    cy.get('#txtEmail').type('falso@correo.com');

    // 🔑 Digita una contraseña incorrecta
    cy.get('#txtPassword').type('incorrecta123');

    // 🔲 Presiona el botón de ingreso
    cy.get('#btnIngresar').click();

    // 🛑 Valida que aparezca el aviso rojo de error controlado del backend
    cy.contains('Credenciales inválidas. El usuario debe realizar el Registro.').should('be.visible');
    
    // 📸 Toma captura del error controlado
    cy.screenshot('CP-002_Error_Controlado');
  });

  it('CP-004: Validación de acumulación matemática del Carrito y simulación de Cierre', () => {
    // Logueamos rápidamente para entrar al flujo
    cy.get('#txtEmail').type('usuario@ejemplo.com');
    cy.get('#txtPassword').type('contraseña123');
    cy.get('#btnIngresar').click();

    // 🛒 Clic en el botón interactivo de VER CARRITO
    cy.get('#btnVerCarrito').click();

    // 💳 Módulo 3: Verifica que calcule el string exacto con la suma de las prendas
    cy.get('#vistaCarrito').should('be.visible');
    cy.contains('Total Neto a Pagar:').should('be.visible');
    cy.contains('$280.000 COP').should('be.visible');

    // 🏁 Finaliza el pedido simulado
    cy.get('#btnFinalizar').click();
  });
});
