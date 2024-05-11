// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui';

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
Vue.component(Message)
Vue.component(MessageBox)
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox

// 限制按钮点击事件，在结果返回以前不能继续点击
Vue.directive("preventReClick", {
  // 插入dom 时做的事情
  inserted: function(el, binding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 1000)
      }
    });
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
