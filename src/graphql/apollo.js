import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import Vue from 'vue'

export const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_API_URL,
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
