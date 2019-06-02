import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const routeNovels = () => import(/* webpackChunkName: "novel" */ '@/views/novel/List.vue');

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [

		/*
		{
			name: 'search',
			path: '/search/:searchType/:searchValue',
			component: routeNovels,
		},
		*/

		{
			name: 'search',
			path: '/search/:searchType',
			component: routeNovels,

			children: [
				{
					path: ':searchValue',
				},
				{
					path: '*',
				},
			],

		},

		{
			name: 'history',
			path: '/history',
			// @ts-ignore
			component: () => import(/* webpackChunkName: "history" */ '@/views/novel/Hisory.vue'),
		},

		{
			name: 'tool',
			path: '/tool',

			// @ts-ignore
			component: () => import(/* webpackChunkName: "tool" */ '@/views/Tool/Tool.vue'),

			children: [
				{
					name: 'cjk-conv',
					path: 'cjk-conv',
					// @ts-ignore
					component: () => import(/* webpackChunkName: "tool" */ '@/views/Tool/CjkConv.vue'),
				},
			],

		},

		{
			path: '/',
			name: 'Novels',
			component: routeNovels,
			alias: '*',
		},

	],
})
