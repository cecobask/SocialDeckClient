import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import Vue from 'vue'

export const apolloClient = new ApolloClient({
  uri: process.env.NODE_ENV === 'staging'
    ? process.env.VUE_APP_TEST_API_URI
    : process.env.VUE_APP_API_URI,
  credentials: 'include',
  clientState: {
    defaults: {
      isEditMode: false
    },
    resolvers: {}
  }
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo)
