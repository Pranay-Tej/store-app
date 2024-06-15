/// <reference types="cypress" />

describe('home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has at least one product visible', () => {
    cy.get('[data-testid="product-list"]')
      .children()
      .its('length')
      .should('be.greaterThan', 1);
  });

  it('opens product detail page', () => {
    cy.get('[data-testid="product-list"] > a').first().click();
    cy.get('[data-testid="product-title"]').should('be.visible');
  });
});
