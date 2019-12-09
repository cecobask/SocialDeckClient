import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueApollo from 'vue-apollo'
import { apolloProvider } from '@/graphql/apollo'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import { store } from '@/store/store'
import fb from '../firebaseConfig'
import VueTopProgress from 'vue-top-progress'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(VueApollo)
Vue.use(Vuelidate)
Vue.use(VueTopProgress)
Vue.use(VModal, { dialog: true })

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      apolloProvider,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
