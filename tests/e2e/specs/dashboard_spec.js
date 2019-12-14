import Users from '../fixtures/Users'
import Posts from '../fixtures/Posts'
import { createPost, deleteFirstPost, logIn, logOut } from '../support/helpers'

describe('Dashboard page', () => {
  context('When a user tries to create a post', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the message field is not empty', function () {
      cy.get('#postsFeed')
        .should('not.exist')
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(1000)
      cy.get('#postsFeed')
        .find('.card')
        .its('length')
        .should('eq', 1)
      cy.get(':nth-child(1) > .card-header > h6')
        .should('exist')
        .contains(Users.validUser.fullName)
      cy.get(':nth-child(1) > .card-header > .text-muted')
        .should('exist')
        .contains('a few seconds ago')
      cy.get(':nth-child(1) > .card-footer')
        .find('button')
        .its('length')
        .should('eq', 4)
      cy.get(':nth-child(1) > .card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
      cy.wait(300)
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
    })
    it('should fail if the message field is empty', function () {
      cy.get('#postMessage')
        .clear()
      cy.get('#createPost')
        .should('be.disabled')
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
    })
    after(function () {
      logOut()
    })
  })

  context('When a user tries to search for posts', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
      createPost(Posts.postForSearching)
      createPost(Posts.shortPost)
    })
    it('should find a post based on message content', function () {
      cy.get('#searchInput')
        .should('exist')
        .and('be.empty')
        .type(Posts.validSearchTermMessage)
        .should('have.value', Posts.validSearchTermMessage)
      cy.get('#postsFeed')
        .find('.card')
        .should('have.length', 1)
        .first()
        .should('contain', Posts.postForSearching)
      cy.get('#searchInput')
        .clear()
        .should('be.empty')
    })
    it('should find a post based on user name', function () {
      cy.get('#searchInput')
        .should('exist')
        .and('be.empty')
        .type(Posts.validSearchTermName)
        .should('have.value', Posts.validSearchTermName)
      cy.get('#searchDropdown')
        .should('contain', 'name')
        .click()
        .find('#nameD')
        .trigger('mouseover')
        .click()
      cy.get('#postsFeed')
        .find('.card')
        .should('have.length', 2)
        .first()
        .should('contain', Posts.shortPost)
      cy.get('#postsFeed')
        .find('.card')
        .eq(1)
        .should('contain', Posts.postForSearching)
      cy.get('#searchInput')
        .clear()
        .should('be.empty')
    })
    it('should show a message if there are no results', function () {
      cy.get('#postsFeed')
        .find('.card')
        .should('exist')
        .and('have.length', 2)
      cy.get('#searchInput')
        .should('exist')
        .and('be.empty')
        .type(Posts.invalidSearchTerm)
        .should('have.value', Posts.invalidSearchTerm)
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
      cy.get('.no-results')
        .should('exist')
        .contains('There are currently no posts')
      cy.get('#searchInput')
        .clear()
        .should('be.empty')
    })
    after(function () {
      deleteFirstPost()
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to delete a post', () => {
    before(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.shortPost)
      logOut()
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the user is the post creator', function () {
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(500)
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
      cy.wait(1000)
      cy.get('#postsFeed')
        .find('.card')
        .its('length')
        .should('eq', 1)
    })
    it('should fail if the user is not the post creator', function () {
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer')
        .find('.btn')
        .eq(2)
        .should('have.class', 'disabled')
      logOut()
    })
    after(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to edit a post', () => {
    before(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.shortPost)
      logOut()
      logIn(Users.validUser.email, Users.validUser.password)
    })
    it('should be successful if the user is the post creator', function () {
      cy.get('#postMessage')
        .should('be.empty')
        .type(Posts.shortPost)
      cy.get('#createPost')
        .should('not.be.disabled')
        .click()
      cy.wait(1000)
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer > .btn-info')
        .click()
      cy.get('.modal-content')
        .should('be.visible')
      cy.get('#textarea')
        .should('have.value', Posts.shortPost)
        .clear()
        .type(Posts.editedPost)
      cy.get('.btn-success')
        .click()
      cy.wait(500)
      cy.get(':nth-child(1) > .card-body > .card-text')
        .contains(Posts.editedPost)
      cy.get('.card-footer > .btn-danger')
        .click()
      cy.get('body')
        .type('{enter}')
    })
    it('should fail if the user is not the post creator', function () {
      cy.get('#postsFeed')
        .find('.card')
        .first()
        .find('.card-footer')
        .find('.btn')
        .eq(1)
        .should('be.visible')
      logOut()
    })
    after(function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to share a post', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
      createPost(Posts.shortPost)
      cy.wait(1000)
    })
    it('should be successful',
      function () {
        cy.get('.btn-dark')
          .should('contain', '0')
          .click()
        cy.wait(1000)
        cy.get('.btn-dark')
          .should('contain', '1')
          .and('be.visible')
      })
    after(function () {
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user tries to like a post', () => {
    before(function () {
      logIn(Users.validUser.email, Users.validUser.password)
      createPost(Posts.shortPost)
      cy.wait(1000)
    })
    it('should be successful if the user hasn\'t liked the post before',
      function () {
        cy.get('.btn-primary')
          .eq(1)
          .should('contain', '0')
          .click()
        cy.wait(500)
        cy.get('.btn-primary')
          .eq(1)
          .should('contain', '1')
          .and('be.visible')
      })
    it('should dislike the post if the user has liked it before', function () {
      cy.get('.btn-primary')
        .eq(1)
        .should('contain', '1')
        .and('be.visible')
        .children('.fa-thumbs-down')
        .should('have.length', 1)

      cy.get('.btn-primary')
        .eq(1)
        .click()
        .should('be.visible')
    })
    after(function () {
      deleteFirstPost()
      logOut()
    })
  })

  context('When a user finds a long post', () => {
    it('should be able to view its full contents', function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      createPost(Posts.longPost)
      cy.get('#showMore')
        .click()
      cy.wait(1000)
      cy.get('.modal-content')
        .should('be.visible')
      cy.get('.close')
        .click()
      deleteFirstPost()
      logOut()
    })
  })

  context('When the dashboard is empty', () => {
    it('should display a message', function () {
      logIn(Users.validUser2.email, Users.validUser2.password)
      cy.get('#postsFeed')
        .find('.card')
        .should('not.exist')
      cy.get('.no-results')
        .should('exist')
        .contains('There are currently no posts')
      logOut()
    })
  })

  context('Navigation bar', () => {
    it('should display the right elements', function () {
      logIn(Users.validUser.email, Users.validUser.password)
      cy.wait(1000)
      cy.get('#nav_collapse ul')
        .its('length')
        .should('eq', 3)
      cy.get('#nav_collapse ul')
        .should('contain', 'Dashboard')
        .and('contain', 'Account')
        .and('contain', 'Log out')
        .and('contain', 'Your posts')
      logOut()
    })
  })
})
