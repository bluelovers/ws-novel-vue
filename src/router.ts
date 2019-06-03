import Vue from 'vue'
import Router from 'vue-router'
import { EnumEventAction } from '@/lib/novel';

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
			name: EnumEventAction.SEARCH,
			path: '/search/:searchType',
			component: routeNovels,

			children: [
				{
					name: EnumEventAction.SEARCH,
					path: ':searchValue',
				},
				{
					name: EnumEventAction.SEARCH,
					path: ':searchValue/index.html',
				},
				{
					name: EnumEventAction.SEARCH,
					path: '*',
				},
			],

		},

		{
			name: 'history',
			path: '/history',
			// @ts-ignore
			component: () => import(/* webpackChunkName: "history" */ '@/views/novel/Hisory.vue'),

			children: [
				{
					path: '*',
				},
			],
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
