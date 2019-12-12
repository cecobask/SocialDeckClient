export function logOut () {
  cy.get('#dropdown__BV_button_').click()
  cy.get('#logout').click()
  cy.wait(1000)
  cy.visit('/')
}

export function logIn (email, password) {
  cy.visit('/')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#submitBtn').click()
  cy.wait(1000)
  cy.visit('/')
}

export function deleteFirstPost () {
  cy.get('#postsFeed')
    .find('.card')
    .first()
    .find('.card-footer')
    .find('.btn')
    .eq(1)
    .click()
  cy.get('body').type('{enter}')
}

export function createPost (message) {
  cy.get('#postMessage')
    .type(message)
  cy.get('#createPost')
    .click()
  cy.wait(500)
}

export function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
