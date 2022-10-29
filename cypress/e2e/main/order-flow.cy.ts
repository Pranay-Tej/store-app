/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const name = faker.name.fullName();
const mobile = faker.datatype.number({
  min: 8000000000,
  max: 9999999999
});
const house = faker.address.buildingNumber();
const street = faker.address.streetName();
const landmark = faker.address.secondaryAddress();
const city = faker.address.cityName();
const pincode = faker.datatype.number({
  min: 500000,
  max: 599999
});

describe('order flow', () => {
  beforeEach(() => {
    cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
  });

  context('add to bag', () => {
    beforeEach(() => {
      cy.visit(`/`);
      cy.get('[data-testid="product-list"] > a').first().click();
      cy.get('[data-testid="product-title"]').should('be.visible');
    });

    it('adds product to cart', () => {
      cy.get('[data-testid="add-to-bag"]').click();
      cy.contains('Add to bag').should('not.exist');
      cy.get('[data-testid="quantity"]').should('contain.text', '1');
    });
  });

  context('cart page', () => {
    beforeEach(() => {
      cy.visit(`/`);
      cy.get('[data-testid="product-list"] > a').first().click();
      cy.get('[data-testid="product-title"]').should('be.visible');
    });

    it('cart page works', () => {
      cy.visit(`/`);
      cy.get('[data-testid="avatar-icon"]').click();
      cy.get('[data-testid="cart-link"]').click();
      cy.contains('Cart').should('be.visible');
    });
  });

  context('checkout', () => {
    // beforeEach(() => {
    //   cy.visit('/cart');
    // });

    it('increases quantity', () => {
      cy.visit('/cart');
      cy.get('[data-testid="increase"]').click();
      cy.get('[data-testid="quantity"]').should('contain.text', '2');
    });

    it('decreases quantity', () => {
      cy.visit('/cart');
      cy.get('[data-testid="decrease"]').click();
      cy.get('[data-testid="quantity"]').should('contain.text', '1');
    });

    it('address selection step', () => {
      cy.visit('/cart');
      cy.get('[data-testid="next"]').click();
      cy.get('[data-testid="new-address"]').click();
      cy.contains('Place Order').should('be.disabled');

      cy.get('#name').type(name);
      cy.get('#mobile').type(mobile.toString());
      cy.get('#house').type(house);
      cy.get('#street').type(street);
      cy.get('#landmark').type(landmark);
      cy.get('#city').type(city);
      cy.get('#pincode').type(pincode.toString());
      cy.get('[data-testid="address-form"]').submit();
      cy.contains(name).should('be.visible');
      cy.get(`[data-testid="address-select-${name}"]`).click();

      cy.contains('Place Order').should('not.be.disabled');
    });

    // it('payment-flow', () => {
    //   cy.visit('/cart');
    //   cy.contains('Next').click();
    //   cy.get('Place Order').should('not.be.disabled');

    // cy.wait(1000);
    // cy.contains('Wallets').click();
    // cy.contains('Test Wallet').click();
    // cy.contains('Simulate Failure').click();
    // cy.window()
    //   .document()
    //   .then(function (doc) {
    //     doc.addEventListener('click', () => {
    //       setTimeout(function () {
    //         doc.location.reload();
    //       }, 5000);
    //     });
    //     cy.contains('Place Order').click();
    //     cy.safeClick('Wallets').click();
    //     cy.safeClick('Test Wallet').click();
    //     cy.safeClick('Simulate Failure').click();
    //   });

    // cy.window()
    //   .document()
    //   .then(function (doc) {
    //     doc.addEventListener('click', () => {
    //       setTimeout(function () {
    //         doc.location.reload();
    //       }, 5000);
    //     });
    //     cy.contains('Retry Payment').click();
    //     cy.safeClick('Wallets').click();
    //     cy.safeClick('Test Wallet').click();
    //     cy.safeClick('Simulate Success').click();
    //   });

    // cy.contains('Wallets').click();
    // cy.contains('Test Wallet').click();
    // cy.contains('Simulate Success').click();

    // cy.contains('Payment successful').should('be.visible');
    // cy.contains('Go to Order').click();
    // cy.contains('Order Details').should('be.visible');
    // cy.contains('PAID').should('be.visible');
    // });
  });

  context('cleanup', () => {
    it('deletes-address', () => {
      cy.visit('/cart');
      cy.get('[data-testid="clear-cart"]').click();
      cy.contains('Your cart is empty').should('be.visible');
    });

    it('deletes address', () => {
      cy.visit('/profile/addresses');
      cy.get(`[data-testid="delete-address-${name}"]`).click();
      cy.contains(name).should('not.exist');
    });
  });
});
