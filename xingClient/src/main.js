import Vue from 'vue'
import App from './App.vue'
import router from './router'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(CKEditor)

Vue.config.productionTip = false

new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
