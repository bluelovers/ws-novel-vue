import Vue from 'vue'
import '../plugins/vuetify'
//import '../plugins/iview'
//import '../plugins/vuesax'
//import LoadScript from 'vue-plugin-load-script';
import vueHeadful from 'vue-headful';

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/style.scss'

const production = process.env.NODE_ENV === 'production';

//Vue.use(LoadScript);

Vue.component('vue-headful', vueHeadful);

if (!production)
{
	Vue.config.performance = true;
	Vue.config.devtools = true
}

export default Vue
