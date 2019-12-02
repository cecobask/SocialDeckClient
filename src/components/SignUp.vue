<template>
  <div id="container">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600' rel='stylesheet'
          type='text/css'>
    <h1>{{title}}</h1>

    <form @submit.prevent="signUp">
      <hr>
      <div class="form-group">
        <label class="icon" for="email"><i class="fa fa-envelope"/></label>
        <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.email.$error }" v-model.trim="email"
               type="email" id="email" placeholder="Email"/>
        <div v-if="submitted && this.$v.email" class="invalid-feedback">
          <span v-if="!this.$v.email.email">Email is invalid!</span>
        </div>
      </div>
      <div class="form-group">
        <label class="icon" for="fullName"><i class="fa fa-user"/></label>
        <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.fullName.$error }" v-model.trim="fullName"
               type="text" id="fullName" placeholder="Full name"/>
        <div v-if="submitted && this.$v.fullName" class="invalid-feedback">
          <span v-if="!this.$v.fullName.firstAndSurname">Full name must consist of two words!</span>
        </div>
      </div>
      <div class="form-group">
        <label class="icon" for="password"><i class="fa fa-shield"/></label>
        <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.password.$error }"
               v-model.trim="password" type="password" id="password" placeholder="Password"/>
        <div v-if="submitted && this.$v.password.$error" class="invalid-feedback">
          <span v-if="!this.$v.password.minLength">Password must be at least 6 characters long!</span>
        </div>
      </div>
      <div class="form-group">
        <label class="icon" for="confirmPass"><i class="fa fa-shield"/></label>
        <input class="form__input" :class="{ 'is-invalid': submitted && this.$v.confirmPass.$error }"
               v-model.trim="confirmPass" type="password" id="confirmPass" placeholder="Confirm password"/>
        <div v-if="submitted && this.$v.confirmPass.$error" class="invalid-feedback">
          <span v-if="!this.$v.confirmPass.sameAsPassword">Passwords must match!</span>
        </div>
      </div>
      <button :disabled="buttonDisabled()" @click="signUp">SUBMIT</button>
    </form>
  </div>
</template>

<script>
import signUp from '@/graphql/User/signUp.graphql'
import { email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'SignUp',
  data () {
    return {
      title: 'SIGN UP',
      email: '',
      fullName: '',
      password: '',
      confirmPass: '',
      submitted: false
    }
  },
  methods: {
    signUp: function () {
      this.submitted = true

      // stop here if form is invalid
      this.$v.$touch()
      if (this.$v.$invalid) return

      let [firstName, lastName] = this.fullName.split(' ')
      this.$apollo.mutate({
        mutation: signUp,
        variables: {
          email: this.email,
          password: this.password,
          firstName: firstName,
          lastName: lastName
        }
      })
        .then(res => {
          if (res.data.signUp) {
            localStorage.setItem('currentUser', this.email)
            this.$router.push('/')
            this.email = ''
            this.fullName = ''
            this.password = ''
            this.confirmPass = ''
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    buttonDisabled: function () {
      return (!this.email || !this.fullName || !this.password || !this.confirmPass)
    }
  },
  validations: {
    fullName: {
      firstAndSurname () {
        return this.fullName.split(' ').length === 2
      }
    },
    email: { email },
    password: { minLength: minLength(6) },
    confirmPass: { sameAsPassword: sameAs('password') }
  }
}
</script>

<style scoped>
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

  #container {
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

  input[type=text], input[type=password], input[type=email] {
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

  #confirmPass {
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
    width: 100px;
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

  button:disabled,
  button[disabled],
  button:disabled:hover{
    border: 1px solid #666666;
    background-color: #cccccc;
    color: #666666;
    top: 3px;
  }
</style>
