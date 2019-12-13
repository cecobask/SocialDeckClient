<template>
  <div id="container">
    <LogIn v-if="!showSignUpForm" @signUpVisible="toggleForm"/>
    <SignUp v-if="showSignUpForm" @signUpVisible="toggleForm"/>
  </div>
</template>

<script>
import LogIn from '@/components/LogIn'
import SignUp from '@/components/SignUp'
import me from '@/graphql/User/me.graphql'

export default {
  name: 'Auth',
  components: {
    'LogIn': LogIn,
    'SignUp': SignUp
  },
  data () {
    return {
      showSignUpForm: false
    }
  },
  methods: {
    toggleForm (bool) {
      this.showSignUpForm = bool
    }
  },
  created: function () {
    this.$apollo.query({
      query: me,
      fetchPolicy: 'no-cache'
    })
      .catch(() => {})
  }
}
</script>

<style scoped>

</style>
