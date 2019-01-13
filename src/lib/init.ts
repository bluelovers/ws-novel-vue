import Vue from 'vue'
import '../plugins/vuetify'
//import '../plugins/iview'
//import '../plugins/vuesax'
//import LoadScript from 'vue-plugin-load-script';
import vueHeadful from 'vue-headful';

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import '@/assets/style.scss'
//import '../plugins/firebase'
import { production, development } from './const'

//Vue.use(LoadScript);

Vue.component('vue-headful', vueHeadful);

if (production || 1)
{
	require('../plugins/vue-analytics');
}

if (!production)
{
	Vue.config.performance = true;
	Vue.config.devtools = true
}

import './global';

export default Vue
