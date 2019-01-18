import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'
//import Novels from './views/novel/List.vue'

Vue.use(Router);

function routeNovels()
{
	return import('./views/novel/List.vue')
}

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [

		{
			name: 'searchValue',
			path: '/search/:searchType/:searchValue',
			component: routeNovels,
		},
		{
			name: 'searchType',
			path: '/search/:searchType',
			component: routeNovels,
		},
		{
			name: 'history',
			path: '/history',
			component: () => import('./views/novel/Hisory.vue'),
		},
		{
			path: '/',
			name: 'Novels',
			component: routeNovels,
			alias: '*',
		},

	],
})
