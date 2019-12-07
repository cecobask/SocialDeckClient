import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDS6zBwUS3stvA3-ktZuvHBHetuFoOZr1I',
  authDomain: 'socialdeck-b41f0.firebaseapp.com',
  databaseURL: 'https://socialdeck-b41f0.firebaseio.com',
  projectId: 'socialdeck-b41f0',
  storageBucket: 'socialdeck-b41f0.appspot.com',
  messagingSenderId: '380181779950',
  appId: '1:380181779950:web:6db8e547ebc93ba2ac6aff',
  measurementId: 'G-TRW13QWRVL'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const currentUser = auth.currentUser

export default {
  auth,
  currentUser
}
