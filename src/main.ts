import Vue from 'vue'
import './lib/init'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),

  mounted()
  {
    try
    {
      document.dispatchEvent(new Event(`render-vue-mounted-event`))
    }
    catch (e)
    {

    }
  },

}).$mount('#app');


