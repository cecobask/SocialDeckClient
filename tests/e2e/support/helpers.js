export function logOut () {
  cy.get('#dropdown__BV_button_').click()
  cy.get('#logout').click()
  cy.wait(500)
  cy.visit('/')
}

export function logIn (email, password) {
  cy.visit('/')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#submitBtn').click()
  cy.wait(500)
}

export function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
//
// export function logIn () {
//   apolloClient.mutate({
//     mutation: logInQ,
//     variables: {
//       email: Users.validUser.email,
//       password: Users.validUser.password
//     }
//   })
//     .catch(({ graphQLErrors }) => {
//       console.log(graphQLErrors)
//     })
// }
