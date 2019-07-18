import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入ui
import './plugins/element.js'
import store from './store'
// 公共样式
import './assets/css/bass.less'
// 字体图标
import './assets/fonts/iconfont.css'
// axios请求
import './api'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
