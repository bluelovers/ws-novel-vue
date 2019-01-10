import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuesax from 'vuesax'
import Vuetify from 'vuetify'
import iView from 'iview';
//import LoadScript from 'vue-plugin-load-script';

Vue.config.productionTip = false;

import '@/assets/style.scss'

Vue.use(Vuesax);
Vue.use(Vuetify);
Vue.use(iView);
//Vue.use(LoadScript);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');


