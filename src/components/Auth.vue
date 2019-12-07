<template>
  <div id="container">
    <LogIn v-if="!showSignUpForm" @signUpVisible="toggleForm"/>
    <SignUp v-if="showSignUpForm" @signUpVisible="toggleForm"/>
  </div>
</template>

<script>
import LogIn from '@/components/LogIn'
import SignUp from '@/components/SignUp'

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
  }
}
</script>

<style scoped>

</style>
