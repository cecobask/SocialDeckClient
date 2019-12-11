// const { apolloClient } = require('../../../src/graphql/apollo')
// const logInQ = require('../../../src/graphql/User/logIn.graphql')
// const Users = require('../fixtures/Users')

export function logOut () {
  cy.get('#dropdown__BV_button_').click()
  cy.get('#logout').click()
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
