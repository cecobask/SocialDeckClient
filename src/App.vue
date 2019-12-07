<template>
  <div id="app">
    <div v-if="currentUser">
      <b-navbar toggleable="md" variant="dark" type="dark">
        <b-navbar-brand to="/">SocialDeck Web App</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"/>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/"><i class="fa fa-home" style="padding: 5px"> Home </i></b-nav-item>
            <b-nav-item to="/feed"><i class="fa fa-list" style="padding: 5px"> News Feed </i></b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Account" right>
              <b-dropdown-header id="dropdown-header-label">{{currentUser.email}}</b-dropdown-header>
              <b-dropdown-item to="/posts"><i class="fa fa-book"> Posts </i></b-dropdown-item>
              <b-dropdown-item to="/logout" @click="logOut"><i class="fa fa-sign-out"> Log out </i></b-dropdown-item>
            </b-nav-item-dropdown>
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
            <b-nav-item to="/auth"><i class="fa fa-sign-in" style="padding: 5px"> LOG IN </i></b-nav-item>
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
import fb from '../firebaseConfig'
import { mapState } from 'vuex'

export default {
  methods: {
    logOut: function () {
      this.$apollo.mutate({
        mutation: logOut
      })
        .catch(err => {
          console.error(err)
        })

      fb.auth.signOut()
        .then(() => {
          this.$store.dispatch('clearData')
          this.$router.push('/auth')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState(['currentUser'])
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

  #userName {
    margin-right: 25px;
  }
</style>
