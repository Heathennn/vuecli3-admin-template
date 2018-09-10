
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from 'store';
import { permission } from './direct';
import App from './App'
 
import { axiosClient } from 'common/axiosClient';

import { getToken } from 'common/utils';

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import 'assets/style/index.scss' // global css

import './permission'


Vue.use(ElementUI, {
  size: 'medium',
})

Vue.config.productionTip = false

Vue.prototype.moment = moment;

axiosClient.defaults.headers.common['token'] = getToken();
axiosClient.defaults.headers.common['userId'] = store.state.auth.userInformation.id;

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
