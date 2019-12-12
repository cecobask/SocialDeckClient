<template>
  <div id="container">
    <vue-topprogress ref="topProgress"/>
    <div id="form">
      <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600' rel='stylesheet'
            type='text/css'>
      <h1>{{title}}</h1>
      <form @submit.prevent="logIn">
        <hr>
        <div class="form-group">
          <label class="icon" for="email"><i class="fa fa-envelope"/></label>
          <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.email.$error }" v-model.trim="email"
                 type="email" id="email" placeholder="Email"/>
          <div v-if="submitted && this.$v.email" class="invalid-feedback">
            <span v-if="!this.$v.email.email">* Email is invalid!</span>
          </div>
        </div>
        <div class="form-group">
          <label class="icon" for="password"><i class="fa fa-shield"/></label>
          <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.password.$error }"
                 v-model.trim="password" type="password" id="password" placeholder="Password"/>
          <div v-if="submitted && this.$v.password.$error" class="invalid-feedback">
            <span v-if="!this.$v.password.minLength">* Password must be at least 6 characters long!</span>
          </div>
        </div>
        <button :disabled="buttonDisabled()" @click="logIn" id="submitBtn">SUBMIT</button>
        <transition name="fade">
          <div v-if="errorMsg" id="error">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </form>
    </div>
    <a @click="showSignUpForm">Don't have an account? Click here to register!</a>
  </div>
</template>

<script>
import logIn from '@/graphql/User/logIn.graphql'
import me from '@/graphql/User/me.graphql'
import { email, minLength } from 'vuelidate/lib/validators'
import fb from '../../firebaseConfig'

export default {
  name: 'LogIn',
  data () {
    return {
      title: 'LOG IN',
      email: '',
      password: '',
      submitted: false,
      errorMsg: null
    }
  },
  methods: {
    logIn: async function () {
      // stop here if form is invalid
      this.submitted = true
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.$refs.topProgress.start()
      const fbData = await fb.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          return { firebaseUID: user.user.uid }
        })
        .catch(() => {})

      await this.$apollo.mutate({
        mutation: logIn,
        variables: {
          email: this.email,
          password: this.password
        }
      })
        .then(res => {
          if (res.data.logIn) {
            this.email = ''
            this.password = ''
          }
        })
        .catch(({ graphQLErrors }) => {
          this.$refs.topProgress.done()
          this.errorMsg = graphQLErrors[0].message
        })

      const userData = this.$apollo.query({
        query: me,
        fetchPolicy: 'no-cache'
      })
        .then(res => {
          const me = res.data.me
          if (me) {
            return me
          }
        })

      const results = await Promise.all([fbData, userData])
      this.$store.commit('setCurrentUser', { ...results[0], ...results[1] })
      await this.$store.dispatch('fetchAllPosts')

      await this.$router.push('/')
        .then(() => {
          this.$refs.topProgress.done()
        })
        .catch(() => {})
    },
    buttonDisabled: function () {
      return (!this.email || !this.password)
    },
    showSignUpForm: function () {
      this.$emit('signUpVisible', true)
    }
  },
  validations: {
    email: { email },
    password: { minLength: minLength(6) }
  }
}
</script>

<style scoped>
  span {
    font-style: italic;
  }

  body,
  input {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    color: #4c4c4c;
  }

  h1 {
    font-size: 32px;
    font-weight: 300;
    color: #4c4c4c;
    text-align: center;
    padding-top: 10px;
    margin-bottom: 10px;
  }

  #form {
    margin: 20px auto;
    width: 400px;
    height: auto;
    -webkit-border-radius: 8px/7px;
    -moz-border-radius: 8px/7px;
    border-radius: 8px/7px;
    background-color: #ebebeb;
    -webkit-box-shadow: 1px 2px 5px rgba(0, 0, 0, .31);
    -moz-box-shadow: 1px 2px 5px rgba(0, 0, 0, .31);
    box-shadow: 1px 2px 5px rgba(0, 0, 0, .31);
    border: solid 1px #cbc9c9;
  }

  form {
    margin: 0 30px;
  }

  hr {
    color: #a9a9a9;
    opacity: 0.3;
  }

  input[type=password], input[type=email] {
    width: 200px;
    height: 39px;
    -webkit-border-radius: 0 4px 4px 0/5px 5px 4px 4px;
    -moz-border-radius: 0 4px 4px 0/0 0 4px 4px;
    border-radius: 0 4px 4px 0/5px 5px 4px 4px;
    background-color: #fff;
    -webkit-box-shadow: 1px 2px 5px rgba(0, 0, 0, .09);
    -moz-box-shadow: 1px 2px 5px rgba(0, 0, 0, .09);
    box-shadow: 1px 2px 5px rgba(0, 0, 0, .09);
    border: solid 1px #cbc9c9;
    padding-left: 10px;
  }

  #password {
    margin-bottom: 10px;
  }

  .icon {
    display: inline-block;
    width: 40px;
    height: 38px;
    background-color: #343A40;
    padding: 8px 8px 8px 8px;
    margin-left: 15px;
    border-radius: 4px 0 0 4px;
    color: white;
    border: solid 0 #cbc9c9;
  }

  button {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 10px 8px 20px 0;
    display: inline-block;
    text-decoration: none;
    width: auto;
    height: 30px;
    border-radius: 5px;
    background-color: #343A40;
    transition: all 0.1s linear 0s;
    top: 0;
    position: relative;
  }

  button:hover {
    top: 3px;
    background-color: #1f242a;
  }

  a:hover {
    cursor: pointer;
  }

  button:disabled,
  button[disabled],
  button:disabled:hover {
    border: 1px solid #666666;
    background-color: #cccccc;
    color: #666666;
    top: 3px;
  }

  #error {
    font-style: italic;
    color: red;
  }
</style>
