<template>

	<v-container>

		<v-timeline
			align-top
			dense
			clipped
			style="max-width: 600px;"
			class="ma-auto"
		>
			<v-timeline-item
				v-for="item in list"
				:key="item.timestamp"
				small
				:color="`${item.color}`"
			>

				<span
					slot="opposite"
					:class="`headline font-weight-bold ${item.color}--text`"
					v-text="item.date"
				></span>

				<div class="py-3">
					<v-tooltip lazy top>
					<h2 :class="`headline font-weight-bold mb-3 ${item.color}--text .display-2`" slot="activator">
						{{item.from}}
					</h2>
						<span v-text="item.date"></span>
					</v-tooltip>
					<div class="list-novels">
						<dl v-for="epub in item.epub">
							<dt class="d-inline-block">
								<v-chip class="caption" small>
									{{epub[0]}}
								</v-chip>
							</dt>
							<dd class="d-inline-block">
								<v-badge right color="green">
								<a
									:href="novelLink(epub[0],epub[1])"
									target="_blank" rel="noopener"
									class="text-none"
									@click="_ga('click', epub[0], epub[1])"
								>{{epub[1]}}</a>
									<span v-if="((epub[2].chapter - epub[2].chapter_old) > 0) && ((epub[2].chapter - epub[2].chapter_old) != epub[2].chapter)" slot="badge">{{ epub[2].chapter - epub[2].chapter_old }}</span>
								</v-badge>
							</dd>
						</dl>
					</div>
				</div>
			</v-timeline-item>
		</v-timeline>

		<v-toolbar
			app
			height="40" :clipped-left="$vuetify.breakpoint.lgAndUp"
			fixed
		>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">

				<router-link to="/" class="text-color-inherit">Novel</router-link>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-items>

				<NavToolbarItems></NavToolbarItems>

			</v-toolbar-items>

		</v-toolbar>

	</v-container>


</template>

<script lang="ts">
import { IVueComponent } from '@/lib/vue/index';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import {
	dataAll,
	EnumEventAction,
	EnumEventLabel,
	IFilterNovelData,
	loadNovelStatCache,
	INovelStatCacheHistory,
	createMoment,
	novelLink,
} from '@/lib/novel';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import { randColor } from '@/lib/colors';
import { IVueAnalytics$ga } from '@/plugins/vue-analytics';

@Component({
	components: {
		NavToolbarItems,
	},
})
export default class History extends Vue
{
	/**
	 * 由於實際上 eventValue 只能是數字 所以只好放棄 eventCategory
	 * @private
	 */
	_ga(this: IVueComponent<History>, eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue)
	}

	novelLink(pathMain: string, novelID: string)
	{
		return novelLink(pathMain, novelID)
	}

	data()
	{
		let _historys = loadNovelStatCache().historys().reverse();

		let list = _historys.reduce(function (ls, row)
		{
			let [timestamp, history] = row;

			let m = createMoment(+timestamp)
				.locale(['ja', 'jp', 'zh-tw', 'zh-cn'])
			;

			let data = {
				timestamp: +timestamp,
				data: history as INovelStatCacheHistory,

				color: randColor().name || randColor().name,

				from: m.fromNow(),
				date: m.format('YYYY-MM-DD'),

				epub: history.epub,
			};

			if (data.epub.length)
			{
				ls.push(data);
			}

			return ls;
		}, [] as {
			timestamp: number,
			data: INovelStatCacheHistory,

			color?,
		}[]);

		return {
			list,
		}
	}

}
</script>

<style scoped lang="scss">
.list-novels {
	&, & li, & ul {
		list-style-type: none;
	}
}
</style>
