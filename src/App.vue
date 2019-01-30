<template>
	<v-app id="app" dark class="caption">
		<vue-headful
			title="Novels"
		/>

		<Topbar></Topbar>

		<v-content>
			<v-container fluid pa-0>
				<router-view class="pa-0 py-2" />
			</v-container>
		</v-content>

		<v-footer app>
			<v-spacer></v-spacer>
			<FooterItems />
			<v-spacer></v-spacer>
			<div class="mx-2 hidden-sm-and-down">
				<a
					:href="`${publicPath}static/novel-stat.json`"
					target="_blank" rel="noopener"
					@click="_ga('click', 'api', 'novel-stat.json')"
					class="d-inline-block mr-2"
					v-once
				>novel-stat.json</a>
				<div class="d-inline-block" v-once>&copy; {{ updateDate }}　</div>
			</div>
		</v-footer>
	</v-app>
</template>

<script lang="ts">
import { IVueComponent } from '@/lib/vue/index';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import FooterItems from '@/components/Nav/FooterItems.vue'
import Topbar from '@/components/Nav/Topbar.vue'

import {
	loadNovelStatCache,
	createMoment,
	EnumEventAction,
	EnumEventLabel,
} from '@/lib/novel';

@Component({
	components: {
		//NavToolbarItems,
		FooterItems,
		Topbar,
	},
})
export default class extends Vue
{

	data()
	{
		let timestamp = loadNovelStatCache().data.meta.timestamp || null;
		let date = createMoment(timestamp || undefined);
		let updateDate: string;

		if (timestamp)
		{
			updateDate = date.format();
		}
		else
		{
			updateDate = date.format('YYYY');
		}

		return {
			updateDate,
		}
	}

	/**
	 * 由於實際上 eventValue 只能是數字 所以只好放棄 eventCategory
	 * @private
	 */
	_ga(this: IVueComponent, eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue)
	}

}
</script>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	/*color: #2C3E50;*/
}

#nav {
	/*padding: 30px;*/

	a {
		font-weight: bold;
		/*color: #2C3E50;*/

		&.router-link-exact-active {
			/*color: #42B983;*/
		}
	}
}
</style>
