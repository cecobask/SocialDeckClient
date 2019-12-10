import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@/components/Auth'
import Dashboard from '@/components/Dashboard'
import OwnPosts from '@/components/OwnPosts'
import firebase from 'firebase/app'
import 'firebase/auth'
import { apolloClient } from '@/graphql/apollo'
import me from '@/graphql/User/me.graphql'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '/ownposts',
    name: 'OwnPosts',
    component: OwnPosts,
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '/logout',
    name: 'LogOut',
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '*',
    redirect: '/dashboard',
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
  const fbUser = firebase.auth().currentUser
  const currentUser = await apolloClient
    .query({ query: me, fetchPolicy: 'no-cache' })
    .catch(() => null)

  if (!fbUser || !currentUser) {
    next('/auth')
  } else {
    next()
  }
}

export default router
