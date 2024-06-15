/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const name = faker.name.fullName();
const updatedName = faker.name.fullName();
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

describe('addresses flow', () => {
  beforeEach(() => {
    cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
  });

  it('address link works', () => {
    cy.visit(`/`);
    cy.get('[data-testid="avatar-icon"]').click();
    cy.get('[data-testid="address-link"]').click();
    cy.contains('My Addresses').should('be.visible');
  });

  it('creates address', function () {
    cy.visit('/profile/addresses');
    cy.get('[data-testid="new-address"]').click();
    cy.get('#name').type(name);
    cy.get('#mobile').type(mobile.toString());
    cy.get('#house').type(house);
    cy.get('#street').type(street);
    cy.get('#landmark').type(landmark);
    cy.get('#city').type(city);
    cy.get('#pincode').type(pincode.toString());
    cy.get('[data-testid="address-form"]').submit();
    cy.contains(name).should('be.visible');
  });

  it('edits address', () => {
    cy.visit('/profile/addresses');
    cy.get(`[data-testid="edit-address-${name}"]`).click();
    cy.get('#name').should('have.value', name);
    cy.get('#name').clear().type(updatedName);
    cy.get('[data-testid="address-form"]').submit();
    cy.contains(updatedName).should('be.visible');
  });

  it('deletes address', () => {
    cy.visit('/profile/addresses');
    cy.get(`[data-testid="delete-address-${updatedName}"]`).click();
    cy.contains(updatedName).should('not.exist');
  });
});
