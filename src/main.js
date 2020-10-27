import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import Vant from "vant";
import "vant/lib/index.css";

//全局导入api.js
import api from './assets/config/api'

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  // vue.prototype.api
  data: {
    api: api
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')