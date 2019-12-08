import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Auth from '@/components/Auth'
import Feed from '@/components/Feed'
import firebase from 'firebase/app'
import 'firebase/auth'

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
    component: Feed,
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
}

export default router
