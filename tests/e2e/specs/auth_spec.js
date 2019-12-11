import Users from '../fixtures/Users'
import { logOut } from '../support/helpers'

describe('Authentication page', () => {
  beforeEach(function () {
    cy.visit('/', { timeout: 15000 })
  })
  context('When an unauthenticated user enters', () => {
    describe('and is an invalid user', () => {
      it('should fail if the password doesn\'t match db record', () => {
        cy.get('#email').type(Users.invalidPasswordUser.email)
        cy.get('#password').type(Users.invalidPasswordUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/auth')
        cy.get('#error')
          .should('exist')
          .contains('Incorrect password!')
      })
      it('should fail if the email doesn\'t exist in the db', () => {
        cy.get('#email').clear().type(Users.invalidEmailUser.email)
        cy.get('#password').type(Users.invalidEmailUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/auth')
        cy.get('#error')
          .should('exist')
          .contains(`No user with email ${Users.invalidEmailUser.email}!`)
      })
      it('should fail if the email is not of valid format', () => {
        cy.get('#email').clear().type(Users.invalidEmailFormatUser.email)
        cy.get('#password').clear().type(Users.invalidEmailFormatUser.password)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
      })
      it('should fail if the password is not of valid format', () => {
        cy.get('#email').clear().type(Users.invalidPasswordFormatUser.email)
        cy.get('#password').clear().type(Users.invalidPasswordFormatUser.password)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Password must be at least 6 characters long!')
      })
      it('should fail if the password and email are not of valid format', () => {
        cy.get('#password').clear().type(Users.invalidPasswordFormatUser.password)
        cy.get('#email').clear().type(Users.invalidEmailFormatUser.email)
        cy.get('#submitBtn').click()
          .url().should('include', '/auth')
        cy.get('.invalid-feedback > span')
          .should('exist')
          .contains('* Email is invalid!')
        cy.contains('* Password must be at least 6 characters long!')
      })
      it('should fail to submit an empty form', () => {
        cy.get('#password').clear()
        cy.get('#email').clear()
        cy.get('#submitBtn').should('be.disabled')
          .url().should('include', '/auth')
      })
      it('should fail to navigate to other routes', () => {
        cy.visit('/dashboard')
          .url().should('include', '/auth')
      })
    })
    describe('and is a valid user', () => {
      it('should be able to navigate to sign up form', () => {
        cy.url().should('include', '/auth')
        cy.get('#container > a').should('exist')
          .should('have.text', 'Don\'t have an account? Click here to register!')
          .click()
        cy.get('h1').should('have.text', 'SIGN UP')
      })
      it('should be able to log in', () => {
        cy.get('#email').type(Users.validUser.email)
        cy.get('#password').type(Users.validUser.password)
        cy.get('#submitBtn').click()
        cy.url().should('include', '/dashboard')
        logOut()
      })
    })
  })
})
