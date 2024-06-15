/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', (username, password) => {
  cy.session('login', () => {
    cy.visit('/accounts/login');
    // cy.get('[data-testid="login-link"]').click();
    cy.get('#identity').clear().type(Cypress.env('USERNAME'));
    cy.get('#password').clear().type(Cypress.env('PASSWORD'), { log: false });
    cy.get('[data-testid="login-form"]').submit();
    cy.contains('Login').should('not.exist');
    // cy.get('[data-testid="avatar-icon"]').click();
    // cy.contains('Order').should('be.visible');
  });
});

// Cypress.Commands.add('safeClick', locator => {
//   cy.window()
//     .document()
//     .then(function (doc) {
//       doc.addEventListener('click', () => {
//         setTimeout(function () {
//           doc.location.reload();
//         }, 2000);
//       });
//       cy.get(locator).click();
//     });
// });
