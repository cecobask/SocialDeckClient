import Vue from 'vue'
import Vuex from 'vuex'
import fb from '../../firebaseConfig'
import me from '@/graphql/User/me.graphql'
import { apolloClient } from '@/graphql/apollo'

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(async user => {
  const userData = await apolloClient.query({
    query: me,
    fetchPolicy: 'no-cache'
  })
    .then(res => {
      const me = res.data.me
      if (me) {
        return me
      }
    })

  if (user && userData) {
    store.commit('setCurrentUser',
      { ...userData, ...{ firebaseUID: user.uid } })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null
  },
  actions: {
    clearData ({ commit }) {
      commit('setCurrentUser', null)
    }
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    }
  }
})
