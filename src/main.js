// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
import MyHttpServer from '@/plugins/http.js'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.prototype.$message = function (msg) {
  ElementUI.Message(msg)
}
Vue.prototype.$message.success = function (msg) {
  return ElementUI.Message.success({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$message.warning = function (msg) {
  return ElementUI.Message.warning({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$message.error = function (msg) {
  return ElementUI.Message.error({
    message: msg,
    duration: 1500
  })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
