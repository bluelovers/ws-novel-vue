<template>

	<v-container>

		<vue-headful
			title="History"
		/>

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
					<h2 :class="`headline font-weight-bold mb-3 ${item.color}--text .display-2 wf-roundedmplus1c`" slot="activator">
						{{item.from}}
					</h2>
						<span v-text="item.date"></span>
					</v-tooltip>
					<div class="list-novels">
						<dl v-for="epub in item.epub">
							<dt class="d-inline-block">
								<v-chip class="caption" small>
									{{epub.pathMain}}
								</v-chip>
							</dt>
							<dd class="d-inline-block">

								<v-tooltip lazy bottom>

								<a
									:href="novelLink(epub.pathMain, epub.novelID)"
									target="_blank" rel="noopener"
									class="text-none"
									@click="_ga('click', epub.pathMain, epub.novelID)"
									slot="activator"
								>{{epub.novelID}}</a>

									<div>
										<div v-for="title in epub.titles">
											{{ title }}
										</div>
									</div>

								</v-tooltip>

								<v-badge right color="green">

									<router-link :to="`/search/author?searchValue=${epub.author}`" class="text-color-inherit">

									<v-chip
										v-if="epub.author"
										small
										class="text-xs-right caption"
										label
										color="pink accent-4" text-color="white"
									>{{ epub.author }}
									</v-chip>

									</router-link>

									<span v-if="(epub.chapter_add > 0) && (epub.chapter_add != epub.chapter)" slot="badge">{{ epub.chapter_add }}</span>
								</v-badge>


							</dd>
						</dl>
					</div>
				</div>
			</v-timeline-item>
		</v-timeline>

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
	NovelInfo,
	getNovelTitleFromMeta,
} from '@/lib/novel';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import { randColor } from '@/lib/colors';
import { IVueAnalytics$ga } from '@/plugins/vue-analytics';
import moment from 'moment';

//import('moment/locale/ja');
//import('moment/locale/zh-tw');
//import('moment/locale/zh-cn');

import url from 'url';

const novelStatCache = loadNovelStatCache();

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
	_ga(eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue)
	}

	novelLink(pathMain: string, novelID: string)
	{
		let novel = novelStatCache.novel(pathMain, novelID);

		let link = novelLink(pathMain, novelID);

		let hash = '#tree-holder';

		if (novel && novel.chapter > 0)
		{
			link = url.resolve(link, '導航目錄.md');

			hash = '#blob-content-holder';
		}
		else if (novel && !novel.chapter)
		{
			hash = '#readme';
		}

		return link + hash;
	}

	data()
	{
		let _historys = novelStatCache.historys().reverse();

		let { timestamp, todayTimestamp } = novelStatCache.data.meta;

		let list = _historys.reduce(function (ls, row)
		{
			let [row_timestamp, history] = row;

			// @ts-ignore
			row_timestamp = +row_timestamp;

			let m = createMoment(row_timestamp);

			// @ts-ignore
			const isToday: boolean = row_timestamp == todayTimestamp;

			if (isToday)
			{
				m = createMoment(timestamp);
			}

			m = m.locale(['ja', 'zh-tw', 'zh-cn']);

			let data = {
				timestamp: row_timestamp as any as number,
				data: history as INovelStatCacheHistory,

				color: randColor().name || randColor().name,

				from: m.fromNow(),
				date: m.format(),

				epub: Object.entries(history.epub || {})
					.reduce(function (ls, [k, epub])
					{
						const pathMain: string = epub[0];
						const novelID: string = epub[1];

						const mdconf = novelStatCache.mdconf_get(pathMain, novelID);

						let subdata = epub[2];

						let data = {
							...subdata,
							pathMain,
							novelID,

							chapter_add: 0,

							author: mdconf && mdconf.novel && mdconf.novel.author,

							titles: getNovelTitleFromMeta(mdconf, novelID)
						};

						if (subdata.chapter)
						{
							data.chapter_add = epub[2].chapter - epub[2].chapter_old
						}

						ls.push(data);

						return ls
					}, []),

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
			from: string,
			date: string,
			epub: INovelStatCacheHistory["epub"],
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
