/**
 * Created by user on 2019/1/13/013.
 */

import { ComponentOptions } from 'vue';
import { VueClass } from 'vue-class-component/lib/declarations';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { IVueAnalytics$ga } from '@/plugins/vue-analytics';

// @ts-ignore
export type IVueComponent<T extends Vue = Vue> = Vue & Partial<ReturnType<T["data"]>> & {
	$ga: IVueAnalytics$ga,
} & T


