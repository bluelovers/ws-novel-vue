import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Novels from './views/novel/List.vue'

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [

//		{
//			path: '/',
//			name: 'home',
//			component: Home,
//		},
//		{
//			path: '/about',
//			name: 'about',
//			// route level code-splitting
//			// this generates a separate chunk (about.[hash].js) for this route
//			// which is lazy-loaded when the route is visited.
//			component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
//		}
//		,
//		{
//			path: '/vuesax',
//			name: 'Vuesax',
//			// route level code-splitting
//			// this generates a separate chunk (about.[hash].js) for this route
//			// which is lazy-loaded when the route is visited.
//			component: () => import(/* webpackChunkName: "about" */ './views/Vuesax.vue'),
//		},

		/*
		{
			path: '/',
			name: 'Novels',
			component: Novels,
		},
		*/

		{
			name: 'search',
			path: '/search/:searchType/:searchValue',
			component: Novels,
		},
		{
			name: 'search',
			path: '/search/:searchType',
			component: Novels,
		},
		{
			path: '/',
			name: 'Novels',
			component: Novels,
			alias: '*',
		},
	],
})
