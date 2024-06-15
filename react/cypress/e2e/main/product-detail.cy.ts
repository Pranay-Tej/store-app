/// <reference types="cypress" />

describe('product-detail-page flow', () => {
  context('login to continue', () => {
    beforeEach(() => {
      cy.visit(`/`);
      cy.get('[data-testid="product-list"] > a').first().click();
      cy.get('[data-testid="product-title"]').should('be.visible');
    });

    it('have login link', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('include', '/accounts/login');
    });
  });

  context('manage cart', () => {
    beforeEach(() => {
      cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
      cy.visit(`/`);
      cy.get('[data-testid="product-list"] > a').first().click();
      cy.get('[data-testid="product-title"]').should('be.visible');
    });

    it('adds product to cart', () => {
      cy.get('[data-testid="add-to-bag"]').click();
      cy.contains('Add to bag').should('not.exist');
      cy.get('[data-testid="quantity"]').should('contain.text', '1');
    });

    it('increases quantity', () => {
      cy.get('[data-testid="increase"]').click();
      cy.get('[data-testid="quantity"]').should('contain.text', '2');
    });

    it('decreases quantity', () => {
      cy.get('[data-testid="decrease"]').click();
      cy.get('[data-testid="quantity"]').should('contain.text', '1');
    });

    it('removes from cart', () => {
      cy.get('[data-testid="decrease"]').click();
      cy.contains('Add to bag').should('be.visible');
    });
  });
});
