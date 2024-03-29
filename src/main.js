import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import _ from 'lodash';
import {ipcRenderer} from 'electron'

Vue.config.productionTip = false
Vue.prototype.$electron = {renderer: ipcRenderer}
Vue.prototype.$_ = _

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
