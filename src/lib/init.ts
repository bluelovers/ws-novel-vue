import Vue from 'vue'
import '../plugins/vuetify'
//import '../plugins/iview'
//import '../plugins/vuesax'
//import LoadScript from 'vue-plugin-load-script';
import vueHeadful from 'vue-headful';
import GlobalEvents from 'vue-global-events'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import '@/assets/style.scss'
//import '../plugins/firebase'
import { production, development } from './const'

import VueSession from 'vue-session'
Vue.use(VueSession, {
	persist: true,
});

declare module 'vue/types/vue'
{

	interface IVueSession
	{
		set(key,value)
		get(key)
		has(key)
		remove(key)
	}

	interface Vue
	{
		$session: IVueSession
	}

	interface VueConstructor
	{
		$session: IVueSession
	}
}

//import Vue2TouchEvents from 'vue2-touch-events'
//Vue.use(Vue2TouchEvents);

//Vue.use(LoadScript);

//import Vuebar from 'vuebar';
//Vue.use(Vuebar);

Vue.component('vue-headful', vueHeadful);
Vue.component('vue-global-events', GlobalEvents);

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
