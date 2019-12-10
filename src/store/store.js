import Vue from 'vue'
import Vuex from 'vuex'
import fb from '../../firebaseConfig'
import me from '@/graphql/User/me.graphql'
import posts from '@/graphql/Post/posts.graphql'
import { apolloClient } from '@/graphql/apollo'

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(async user => {
  let userData = await apolloClient.query({
    query: me,
    fetchPolicy: 'no-cache'
  })
    .then(res => {
      const me = res.data.me
      if (me) {
        return me
      }
    })
    .catch(() => {})

  if (user && userData) {
    store.commit('setCurrentUser',
      { ...userData, ...{ firebaseUID: user.uid } })
    await store.dispatch('fetchAllPosts')
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    posts: null
  },
  actions: {
    clearData ({ commit }) {
      commit('setCurrentUserPosts', null)
      commit('setCurrentUser', null)
      commit('setPosts', null)
    },
    fetchAllPosts ({ commit }) {
      apolloClient.query({
        query: posts,
        fetchPolicy: 'no-cache'
      })
        .then(res => {
          let results = res.data.posts
          if (results) {
            commit('setPosts', results)
          }
        })
        .catch(() => {})
    },
    fetchUserPosts ({ commit }) {
      apolloClient.query({
        query: me,
        fetchPolicy: 'no-cache'
      })
        .then(res => {
          let posts = res.data.me.posts
          if (posts) {
            commit('setCurrentUserPosts', posts)
          }
        })
        .catch(() => {})
    }
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setPosts (state, val) {
      state.posts = val
    },
    setCurrentUserPosts (state, val) {
      state.currentUser.posts = val
    }
  },
  getters: {
    allPosts: state => {
      if (!state.posts) return
      return state.posts
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
    },
    currentUserPosts: state => {
      const cu = state.currentUser
      if (!cu || !cu.posts) return
      return cu.posts.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
    }
  }
})
