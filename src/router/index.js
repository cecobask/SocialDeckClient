import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import SignUp from '@/components/SignUp'
import LogIn from '@/components/LogIn'
import me from '@/graphql/User/me.graphql'
import { apolloClient } from '@/graphql/apollo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    async beforeEnter (to, from, next) {
      await checkAuth(next)
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
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
  await apolloClient.query({
    query: me,
    variables: {
      fakeVar: 'nothing'
    },
    fetchPolicy: 'no-cache'
  })
    .then(() => {
      next()
    })
    .catch(err => {
      console.error(err)
      if (this.$router.currentRoute.name !== 'LogIn') next('/login')
    })
}

export default router
