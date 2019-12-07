import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Auth from '@/components/Auth'
// import me from '@/graphql/User/me.graphql'
// import { apolloClient } from '@/graphql/apollo'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/logout',
    name: 'LogOut',
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '/feed',
    name: 'Feed',
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

async function checkAuth (next) {
  const currentUser = firebase.auth().currentUser

  if (!currentUser) {
    next('/auth')
  } else {
    next()
  }

  // await apolloClient.query({
  //   query: me,
  //   variables: {
  //     fakeVar: 'nothing'
  //   },
  //   fetchPolicy: 'no-cache'
  // })
  //   .then(() => {
  //     next()
  //   })
  //   .catch(err => {
  //     console.error(err)
  //     next('/login')
  //   })
}

export default router
