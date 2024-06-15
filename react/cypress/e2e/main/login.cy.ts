/// <reference types="cypress" />

describe('login', () => {
  it('login', () => {
    cy.visit('/');
    cy.get('[data-testid="login-link"]').click();
    cy.get('#identity').clear().type(Cypress.env('USERNAME'));
    cy.get('#password').clear().type(Cypress.env('PASSWORD'), { log: false });
    cy.get('[data-testid="login-form"]').submit();
    cy.contains('Login').should('not.exist');
    cy.get('[data-testid="avatar-icon"]').click();
    cy.contains('Order').should('be.visible');
  });
});
