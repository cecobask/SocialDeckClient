export function logOut () {
  cy.get('#dropdown__BV_button_').click()
  cy.get('#logout').click()
}
