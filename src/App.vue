<template>
  <div id="app">
    <vue-topprogress ref="topProgress"/>
    <div v-if="currentUser">
      <b-navbar toggleable="md" variant="dark" type="dark">
        <b-navbar-brand to="/dashboard">SocialDeck Web App</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"/>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/dashboard"><i class="fa fa-columns"> Dashboard </i></b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right id="dropdown">
              <template slot="button-content">
                <i class="fa fa-user-circle"/>
                <b-nav-text>Account</b-nav-text>
              </template>
              <b-dropdown-header id="dropdown-header-label">{{currentUser.email}}</b-dropdown-header>
              <b-dropdown-item to="/ownposts"><i class="fa fa-book"> Your posts </i></b-dropdown-item>
              <b-dropdown-item to="/logout" @click="logOut" id="logout"><i class="fa fa-sign-out"> Log out </i></b-dropdown-item>
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
        <b-navbar-brand>SocialDeck Web App</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"/>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/auth"><i class="fa fa-sign-in" style="padding: 5px"> Log in </i></b-nav-item>
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
      this.$refs.topProgress.start()
      this.$apollo.mutate({ mutation: logOut })
        .then(() => {
          this.$router.push('/auth')
          this.$store.dispatch('clearData')
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          this.$refs.topProgress.done()
          console.error(graphQLErrors)
        })

      fb.auth.signOut()
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

  i {
    padding: 5px
  }
</style>
