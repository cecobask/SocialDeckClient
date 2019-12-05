<template>
  <div id="app">
    <div v-if="userLoggedIn()">
      <b-navbar toggleable="md" variant="dark" type="dark">
        <b-navbar-brand to="/">SocialDeck Web App</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"/>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/"><i class="fa fa-home" style="padding: 5px"> HOME </i></b-nav-item>
            <b-nav-item to="/feed"><i class="fa fa-list" style="padding: 5px"> News Feed </i></b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/logout" @click="logOut"><i class="fa fa-sign-out" style="padding: 5px"> LOG OUT </i>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>

    <div v-else>
      <b-navbar toggleable="md" variant="dark" type="dark">
        <b-navbar-brand to="/">SocialDeck Web App</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"/>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/signup"><i class="fa fa-sign-in" style="padding: 5px"> SIGN UP </i></b-nav-item>
            <b-nav-item to="/login"><i class="fa fa-sign-in" style="padding: 5px"> LOG IN </i></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import logOut from '@/graphql/User/logOut.graphql'

export default {
  methods: {
    logOut: function () {
      this.$apollo.mutate({
        mutation: logOut
      })
        .then(() => {
          localStorage.removeItem('currentUser')
          this.$router.push('/login')
        })
        .catch(err => {
          console.error(err)
        })
    },
    userLoggedIn: function () {
      return 'currentUser' in localStorage
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
