import Vue from 'vue'
import Vuex from 'vuex'
import fb from '../../firebaseConfig'

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
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
