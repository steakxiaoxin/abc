import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import dayjs from 'dayjs'

Vue.config.productionTip = false
Vue.prototype.dayjs = dayjs
Vue.use(ElementUI)
Vue.use(dayjs)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
