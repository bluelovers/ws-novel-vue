<template>

	<v-container>

		<vue-headful
			:title="title"
		/>

		<vue-global-events

			@keyup.left="pagePrev"
			@keyup.right="pageNext"

			@keyup.page-up="pagePrev"
			@keyup.page-down="pageNext"

		/>

		<v-layout
			v-touch="{
				left: () => pageNext(),
				right: () => pagePrev()
			}"
		>
			<v-flex sm10 offset-sm1>

				<v-flex
					align-center
					align-content-center
					justify-center
					class="pagination-div"
				>
					<v-pagination
						:length="pages"
						v-model="page"
						:total-visible="7"
						circle
						@input="updateResource"
					></v-pagination>
				</v-flex>

				<v-container
					v-if="cur_len"

					align-center="true"
					align-content-center="true"
					justify-center="true"
					fluid>
					<v-layout
						row wrap
						align-center="true"
						align-content-center="true"
					>
						<v-flex
							v-for="item in novels"
							md4
							flat tile
							class="my-novel"
						>

							<v-hover>

								<v-card slot-scope="{ hover }">
									<v-layout>

										<v-flex>


											<a
												:href="novelLink(item)"
												target="_blank"
												rel="noopener"
												class="text-none"
												@click="_ga('click', item.pathMain, item.novelID)"
											>

												<v-tooltip lazy bottom>

													<v-img
														:src="item.mdconf.novel.cover"
														:lazy-src="img_unsplash(item)"
														height="150px"
														align-center="true"
														align-content-center="true"
														v-on:error="imageError"
														v-on:load="imageLoaded"
														slot="activator"
														onclick="this && this.blur && this.blur()"
													>
														<v-expand-transition>
															<div
																v-if="hover"
																class="d-flex transition-fast-in-fast-out purple darken-4  v-card--reveal white--text caption pre-wrap pa-0 ma-0"
																style="height: 100%;"
															>{{ item.mdconf.novel.preface }}
															</div>
														</v-expand-transition>


														<v-container pa-0 text-xs-right class="my-novel-tag" style="position: absolute;bottom: 0;right: 0;">

															<v-chip
																v-if="item.mdconf.novel.author"
																small
																class="text-xs-right caption"
																label
																color="pink accent-4" text-color="white"
																@click.prevent="_searchByAuthor(item.mdconf.novel.author)"
															>{{ item.mdconf.novel.author }}
															</v-chip>

															<v-chip
																small
																class="text-xs-right caption"
																label
																color="purple darken-4" text-color="white"

																:href="novelLink(item, true)"
																target="_blank"
																rel="noopener"
																@click.self="_ga('click', item.pathMain, 'pathMain')"

															>{{ item.pathMain }}
															</v-chip>


														</v-container>


													</v-img>


													<v-container
														fill-height
														fluid
														pa-2
														style="height: 3em"
														slot="activator"

													>
														<v-layout fill-height>
															<v-flex xs12 align-end flexbox overflow-hidden class="text-no-wrap text-truncate">
																<span v-text="item.title"></span>
															</v-flex>
														</v-layout>
													</v-container>


													<div slot="default" v-html="itemPopup(item)">
														<!--div v-for="title in getNovelTitleFromMeta(item.mdconf, item.novelID)">
															{{ title }}
														</div-->
													</div>

												</v-tooltip>

											</a>


										</v-flex>

									</v-layout>
								</v-card>

							</v-hover>


						</v-flex>

					</v-layout>

					<v-layout
						row wrap
						align-center="true"
						align-content-center="true"
						class="mt-2"
					>
						<div style="text-align: center">
						<router-link
							v-for="author in cur_author_list"
							:to="`/search/author?searchValue=${author}`" class="text-color-inherit"
						>
							<v-chip
								small
								class="caption"
								label
								color="pink accent-4" text-color="white"
							>{{ author }}
							</v-chip>
						</router-link>
						</div>
					</v-layout>

				</v-container>

				<v-container
					v-else-if="pages == 0"
					align-center="true"
					align-content-center="true"
					justify-center="true"
				>
					<v-alert
						:value="true"
						type="error"
						dismissible
						style="max-width: 250px;border-radius: 10px;"
						@input="_searchResetButton"
					>
						NONE
					</v-alert>
				</v-container>

				<v-progress-circular
					v-else
					indeterminate
					color="purple"
				></v-progress-circular>

				<v-flex
					align-center
					align-content-center
					justify-center
					class="pagination-div"
				>
					<v-pagination
						:length="pages"
						v-model="page"
						:total-visible="7"
						circle
						@input="updateResource"
					></v-pagination>
				</v-flex>

			</v-flex>
		</v-layout>

		<Topbar @drawer="onDrawer" :drawerValue="drawer">

			<v-text-field
				flat
				solo-inverted
				hide-details
				prepend-inner-icon="search"
				label="Search"
				class="caption"
				browser-autocomplete="true"
				clearable
				placeholder="搜尋標題 (使用 regexp-cjk 支援自動轉換簡繁日字漢字，以及一部分的 REGEXP 語法，空白視為分隔)"
				persistent-hint
				:value="cur_keyword"
				@change="searchByKeyword"
				@click:clear="_searchResetButton"

				@keyup.left="_stopEvent"
				@keyup.right="_stopEvent"

				@keyup.page-up="_stopEvent"
				@keyup.page-down="_stopEvent"

			></v-text-field>

		</Topbar>

		<v-navigation-drawer
			:clipped="$vuetify.breakpoint.lgAndUp"
			app
			v-model="drawer"
		>

			<v-expansion-panel
				expand
				focusable
			>
				<v-expansion-panel-content>
					<div slot="header">Options</div>
					<v-card>
						<v-card-text expand>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="update_date" v-model="searchOptions.update_date"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.update_date_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="epub_date" v-model="searchOptions.epub_date"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.epub_date_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="segment_date" v-model="searchOptions.segment_date"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.segment_date_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="title" v-model="searchOptions.title"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.title_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="volume" v-model="searchOptions.volume"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.volume_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-checkbox class="shrink my-0 mr-2" label="chapter" v-model="searchOptions.chapter"></v-checkbox>
								<v-checkbox class="my-0" v-model="searchOptions.chapter_reverse" on-icon="trending_down" off-icon="trending_up"></v-checkbox>
							</v-layout>

							<v-layout align-center>
								<v-expansion-panel popout class="novel_status-area">
									<v-expansion-panel-content>
										<div slot="header">
											<v-checkbox class="shrink my-0 mr-2" label="novel_status" v-model="searchOptions.novel_status"></v-checkbox>
										</div>
										<v-card>
											<OptionFilterEnumNovelStatus
												v-model="searchOptions.novel_status_value"
												:value="searchOptions.novel_status_value"
												@input="searchOptions.novel_status_value = $event"
											></OptionFilterEnumNovelStatus>
										</v-card>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-layout>

						</v-card-text>
					</v-card>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<PanelFilterTag3
				title="Tag"

				icon="label"

				:items="tags"
				:value="cur_tag"

				:itemOptions="searchItemOptions('tag')"

				@click="_searchByTag2"
				@reset="_searchResetTag2"
			></PanelFilterTag3>

			<v-divider></v-divider>

			<PanelFilterTag
				title="Authors"

				icon="school"

				:items="authors"
				:value="cur_author"

				@click="_searchByAuthor"
				@reset="_searchResetAuthor"
			></PanelFilterTag>

			<v-divider></v-divider>

			<PanelFilterTag
				title="Contributes"

				icon="people"

				:items="contributes"
				:value="cur_contribute"

				@click="_searchByContribute"
				@reset="_searchResetContribute"
			></PanelFilterTag>

			<v-divider></v-divider>

			<PanelFilterTag
				title="Publisher"

				icon="local_library"

				:items="publishers"
				:value="cur_publisher"

				@click="_searchByPublisher"
				@reset="_searchResetPublisher"
			></PanelFilterTag>

			<PanelFilterTag
				title="Illust"

				icon="color_lens"

				:items="illusts"
				:value="cur_illust"

				@click="_searchByIllust"
				@reset="_searchResetIllust"
			></PanelFilterTag>

			<PanelFilterTag2
				title="Chapters"

				icon="library_books"

				:items="chapter_range"
				:value="cur_chapter_range"

				@click="_searchByChapterRange"
				@reset="_searchResetChapterRange"
			></PanelFilterTag2>

			<v-divider></v-divider>

		</v-navigation-drawer>

	</v-container>

</template>

<script lang="ts">
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import Topbar from '@/components/Nav/Topbar.vue'
import PanelFilterTag from '@/components/Novel/PanelFilterTag.vue'
import PanelFilterTag2 from '@/components/Novel/PanelFilterTag2.vue'
import PanelFilterTag3, { IVChipTagItem, IVChipTagOptions } from '@/components/Novel/PanelFilterTag3.vue'
import { EnumNovelStatus } from 'node-novel-info/lib/const'
import OptionFilterEnumNovelStatus from '@/components/Novel/OptionFilterEnumNovelStatus.vue'
import { NodeNovelInfo } from 'node-novel-info/class'

import {
	cacheSortCallback,
	createMoment,
	dataAll,
	EnumEventAction,
	EnumEventLabel,
	getNovelTitleFromMeta,
	IFilterNovelData,
	IFilterNovelDataPlus, listChapterRange,
	novelLink,
	novelLinkPathMain,
} from '@/lib/novel';
import { img_unsplash, referrer_search } from '@/lib/util';
import { IVueComponent } from '@/lib/vue/index';
import { array_unique } from 'array-hyper-unique'
import url from 'url';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router'
import { handleSearchText, toHalfWidthLocaleLowerCase } from '@/lib/conv';
import { zhRegExpGreedy, zhRegExpGreedyMatchWords } from '@/lib/regexp';
import { sortSeriesCallback } from '@/lib/util/sort';

let NovelData: ReturnType<typeof dataAll>;

const lowSrcMap = new WeakMap();

@Component({
	components: {
		NavToolbarItems,
		Topbar,
		PanelFilterTag,
		PanelFilterTag2,
		PanelFilterTag3,
		OptionFilterEnumNovelStatus,
	},
})
export default class List extends Vue
{
	//$ga: IVueAnalytics$ga;

	page: number;
	drawer: boolean;
	pageInit: number;

	novels_all: IFilterNovelDataPlus[];

	searchOptions: {
		epub_date: boolean,
		epub_date_reverse: boolean,

		segment_date: boolean,
		segment_date_reverse: boolean,

		update_date: boolean,
		update_date_reverse: boolean,

		chapter: boolean,
		chapter_reverse: boolean,

		title: boolean,
		title_reverse: boolean,

		volume: boolean,
		volume_reverse: boolean,

		novel_status: boolean,
		novel_status_value: EnumNovelStatus | number,
	};

	data()
	{
		if (!NovelData)
		{
			NovelData = dataAll();
		}

		let page_size = 12;
		let page = 1;

		let chapter_range = listChapterRange(NovelData.max_chapter);

		let data = {
//			dialog: false,
			drawer: false,

			cur_len: 0,
			page_size,
			novels: [] as typeof NovelData["novels"],
			page,
			pages: 1,
			pageInit: null as number,

			tags: [] as typeof NovelData["tags"],
			contributes: [] as typeof NovelData["contributes"],
			authors: NovelData["authors"],

			chapter_range,
			cur_chapter_range: null as number,

			novels_all: NovelData.novels,

			cur_keyword: '',
			cur_tag: [],
			cur_contribute: '',
			cur_author: '',

			cur_author_list: [] as string[],

			cur_title: '',
			title: '',

			cur_publisher: '',
			publishers: NovelData["publishers"],

			cur_illust: '',
			illusts: NovelData["illusts"],

			searchOptions: {
				epub_date: true,
				epub_date_reverse: null,

				segment_date: null,
				segment_date_reverse: null,

				update_date: null,
				update_date_reverse: null,

				chapter: null,
				chapter_reverse: null,

				title: null,
				title_reverse: null,

				novel_status: null,
				novel_status_value: 0 as EnumNovelStatus | number,

				...this._filterNullSearchOptions(this.$session.get('searchOptions') || {}),
			} as List["searchOptions"],

			EnumNovelStatus,
		};

		this.$nextTick(() => this._data_init());

		return data;
	}

	_filterNullSearchOptions(searchOptions: List["searchOptions"]): List["searchOptions"]
	{
		return Object.entries(searchOptions)
			.reduce(function (a, b)
			{
				if (b[1] != null)
				{
					a[b[0]] = b[1];
				}

				return a;
			}, {} as List["searchOptions"])
		;
	}

	itemPopup(item: IFilterNovelDataPlus)
	{
		return [
			getNovelTitleFromMeta(item.mdconf, item.novelID).join('<br/>'),
			// @ts-ignore
			createMoment(item.update_date2).format(),
		].join('<br/>')
	}

	onDrawer(drawer: boolean)
	{
		this.drawer = drawer;
	}

	getNovelTitleFromMeta(mdconf, novelID?)
	{
		let ls = getNovelTitleFromMeta(mdconf, novelID)
		return ls
	}

	_setTitle(this: IVueComponent<List>, titles: string[] | string)
	{
		if (Array.isArray(titles))
		{
			titles = titles.join(' - ');
		}
		else if (!titles || !titles.length)
		{
			titles = ''
		}

		this.cur_title = titles;

		this._updateTitle();
	}

	_updateTitle(this: IVueComponent<List>)
	{
		if (this.cur_title)
		{
			this.title = this.cur_title + ' - Novel';
		}
		else
		{
			this.title = 'Novel'
		}
	}

	_data_init()
	{
		this._updateTitle();
		let refdata = referrer_search();

		//console.dir(this.$route.query.page);

		if (this.$route.query.page)
		{
			this.pageInit = this.page = (this.$route.query.page as any) | 0;
		}

		// @ts-ignore
		if (this.$route.params.searchType)
		{
			setTimeout(() => this.onRouterChanged(this.$route, null), 250);
		}
		else if (refdata && refdata.keywords.length)
		{
			let k = refdata.keywords.join(' ');

			console.log(`檢測到 referrer 關鍵字`, refdata, k);

			setTimeout(() => this._search(EnumEventLabel.KEYWORD, k), 250);
		}
		else
		{
			this._updateSort();

			setTimeout(() => this.updateResource(this.page), 250);
		}
	}

	/**
	 * merge Route.query Route.params
	 */
	_queryParams(to: Route)
	{
		let q = {
			searchValue: '',
			searchType: '' as EnumEventLabel,
			...to.query,
			...to.params,
		};

		// @ts-ignore
		q.searchValue = to.query.searchValue || to.params.searchValue || '';

		return q;
	}

	_stopEvent(event: Event)
	{
		event.stopImmediatePropagation();
	}

	@Watch('$route')
	onRouterChanged(to: Route, from?: Route)
	{

		if (to && from)
		{
			let q1 = this._queryParams(to);
			let q2 = this._queryParams(from);

			if (q1.searchType == q2.searchType && q1.searchValue == q1.searchValue)
			{
				return;
			}
		}

		//console.log('onRouterChanged', to, from);
		if (to.name == EnumEventAction.SEARCH)
		{
			let q = this._queryParams(to);

			//console.log('onRouterChanged', q);

			this._search(q.searchType, q.searchValue);
		}
		else
		{
			this._searchReset(EnumEventLabel.KEYWORD)
		}
	}

	EnumEventLabel = EnumEventLabel;

	_search(searchType: EnumEventLabel, searchValue: string)
	{
		switch (searchType)
		{
			case EnumEventLabel.TAG:
				this._searchByTag(searchValue);
				break;
			case  EnumEventLabel.AUTHOR:
				this._searchByAuthor(searchValue);
				break;
			case  EnumEventLabel.CONTRIBUTE:
				this._searchByContribute(searchValue);
				break;
			case  EnumEventLabel.KEYWORD:
				this._searchByKeyword(searchValue);
				break;
			case  EnumEventLabel.PUBLISHER:
				this._searchByPublisher(searchValue);
				break;
			case  EnumEventLabel.ILLUST:
				this._searchByIllust(searchValue);
				break;
			case  EnumEventLabel.CHAPTER_RANGE:
				this._searchByChapterRange(searchValue as any);
				break;
			default:
				throw new TypeError(`searchType not exists: ${searchType}`)
		}

		this._setTitle([searchValue, searchType]);

		this._updateSort(null, true);
		this.$session.set('searchOptions', this.searchOptions);
	}

	_searchStatReset()
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_tag = null;
		_this.cur_contribute = '';
		_this.cur_keyword = '';
		_this.cur_author = '';
		_this.cur_publisher = '';
		_this.cur_chapter_range = null;
		_this.cur_illust = '';

		this.searchOptions.novel_status = null;
	}

	_searchByChapterRange(value: {
		value: number,
		min: number,
		label: string,
	} | string)
	{
		return this.__searchBy001<{
			value: number,
			min: number,
			label: string,
		} | string, number[]>({
			searchType: EnumEventLabel.CHAPTER_RANGE,
			searchValue: value,

			data_cur_key: 'cur_chapter_range',

			handleValue(value): number[]
			{
				return ((
					(typeof value === 'object')
						? [value.min, value.value]
						: (value as string).split(/[-,]/)
				) as number[]).map(v => v | 0);
			},

			handleKeyword(value, handledValue)
			{
				return handledValue.join('-')
			},

			handleData(value, handledValue)
			{
				return handledValue[1]
			},

			eachFilter(novel: IFilterNovelData, cache)
			{
				let i = (novel.cache && novel.cache.chapter) | 0;

				if (i >= cache.keyword[0] && i <= cache.keyword[1])
				{
					return true;
				}
			},

			onPreCheck({
				keyword,
			})
			{
				return keyword.length == 2
			},
		});
	}

	_searchByPublisher(value: string)
	{
		return this.__searchBy001({
			searchType: EnumEventLabel.PUBLISHER,
			searchValue: value,

			data_cur_key: 'cur_publisher',

			eachFilter(novel: IFilterNovelData, cache,
			): boolean
			{
				if (
					novel.mdconf.novel
					&& novel.mdconf.novel.publishers
					// @ts-ignore
					&& novel.mdconf.novel.publishers.includes(cache.keyword)
				)
				{
					return true;
				}
			},
		});
	}

	_searchResetPublisher()
	{
		return this._searchReset(EnumEventLabel.PUBLISHER)
	}

	protected __searchBy001<V extends unknown | string | number, R extends unknown | string>(setting: {
		searchType: EnumEventLabel,
		searchValue: V,

		data_cur_key: string,

		handleValue?<T extends R>(value: V, handledValue?: T): R,
		handleKeyword?<T extends R>(value: V, handledValue: T): string,
		handleData?<T extends R>(value: V, handledValue: T),

		onSearchReset?(this: List),

		eachFilter(novel: IFilterNovelData, cache: {
			searchValue: V,
			preCheckReturn: unknown,
			keyword: R,
			list: IFilterNovelData[],
		}): boolean,

		onPreCheck?(cache: {
			searchValue: V,
			keyword: R,
		}): boolean,
	})
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		let {
			searchType,
			searchValue,
			data_cur_key,

			handleValue,
			handleKeyword,
			handleData,
			eachFilter,

			onSearchReset,

			onPreCheck,
		} = setting;

		_this.cur_len = 0;

		let keyword = handleValue ? handleValue(searchValue) : searchValue;

		let keyword2: string;

		if (handleKeyword || handleValue)
		{
			// @ts-ignore
			keyword2 = (handleKeyword ? handleKeyword : handleValue)(searchValue, keyword);
		}
		else
		{
			// @ts-ignore
			keyword2 = searchValue;
		}

		let keyword3;

		if (handleData || handleKeyword || handleValue)
		{
			// @ts-ignore
			keyword3 = (handleData || handleKeyword || handleValue)(searchValue, keyword);
		}
		else
		{
			keyword3 = keyword2;
		}

		/*
		console.log({
			keyword,
			keyword2,
			keyword3,
		});
		*/

		this._searchStatReset();

		// @ts-ignore
		onSearchReset && onSearchReset.call(this as List);

		_this[data_cur_key] = keyword3;

		this._ga(EnumEventAction.SEARCH, searchType, keyword2);

		this._searchUpdateRouter(searchType, keyword2);

		const self = this;

		let onPreCheckReturn: unknown;
		let _cache = {
			searchValue,
			keyword,
		};

		// @ts-ignore
		if (!onPreCheck || onPreCheck && (onPreCheckReturn = onPreCheck(_cache)))
		{
			let cache = NovelData.novels
				.reduce(function (cache, novel)
				{
					// @ts-ignore
					let bool = eachFilter(novel, cache);

					if (bool)
					{
						cache.list.push(novel)
					}

					return cache;
				}, {
					..._cache,
					preCheckReturn: onPreCheckReturn,
					list: [] as IFilterNovelData[],
				})
			;

			//console.log(cache);

			self._updateList(cache.list);
		}
		else
		{
			self._updateList([]);
		}
	}

	_searchByIllust(value: string)
	{
		return this.__searchBy001({
			searchType: EnumEventLabel.ILLUST,
			searchValue: value,

			data_cur_key: 'cur_illust',

			eachFilter(novel: IFilterNovelData, cache,
			): boolean
			{
				if (
					novel.mdconf.novel
					&& novel.mdconf.novel.illusts
					&& novel.mdconf.novel.illusts.includes(cache.keyword)
				)
				{
					return true;
				}
			},
		});
	}

	_searchResetIllust()
	{
		return this._searchReset(EnumEventLabel.ILLUST)
	}

	_searchResetChapterRange()
	{
		return this._searchReset(EnumEventLabel.CHAPTER_RANGE)
	}

	_searchReset(searchType: EnumEventLabel)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		this._searchStatReset();

		_this.cur_len = 0;

		this._updateList(NovelData.novels);

		this._searchUpdateRouter(EnumEventLabel.KEYWORD, '');

		this._setTitle('');
	}

	_updateRouterPage()
	{
		let page: any = this.page;
		let query = {
			...this.$route.query,
		} as {
			page: string
		};

		if (page != query.page && (page || query.page))
		{
			if (page > 1)
			{
				query.page = page;
			}
			else
			{
				delete query.page;
			}

			this.$router.push({
				path: this.$route.path,
				query,
			})
		}
	}

	_searchUpdateRouter(searchType: EnumEventLabel, searchValue: string | number)
	{
		//console.log('_searchUpdateRouter', searchType, searchValue);

		let query = {} as any;

		if (this.page > 1)
		{
			query.page = this.page;
		}

		if (searchValue)
		{
			let q = this._queryParams(this.$route);

			if (q.searchType !== searchType || q.searchValue != searchValue)
			{
				query.searchValue = searchValue as string || '';

				this.$router.push({
					//path: `/${EnumEventAction.SEARCH}/${searchType}?searchValue=${searchValue || ''}`,

					path: `/${EnumEventAction.SEARCH}/${searchType}`,
					query,
				});
			}
		}
		else
		{
			this.$router.push({
				path: `/`,
				query,
			});
		}
	}

	novelLink(data: IFilterNovelData, pathMainOnly?: boolean)
	{
		let link: string;

		if (pathMainOnly)
		{
			link = novelLinkPathMain(data.pathMain);
		}
		else
		{
			link = novelLink(data.pathMain, data.novelID);
		}

		let hash = '#tree-holder';

		if (data.cache && data.cache.chapter > 0)
		{
			link = url.resolve(link, '導航目錄.md');

			hash = '#blob-content-holder';
		}
		else if (data.cache && !data.cache.chapter)
		{
			hash = '#readme';
		}

		return link + hash;
	}

	_searchResetButton()
	{
		this._searchResetKeyword();

		this.searchOptions.novel_status = null;

		this.watchSort();
	}

	_searchResetKeyword()
	{
		this._searchReset(EnumEventLabel.KEYWORD)
	}

	beforeRouteUpdate(to, from, next)
	{
		console.log('beforeRouteUpdate', to, from, next);
		next();
	}

	searchByKeyword(keyword: string)
	{
		return this._search(EnumEventLabel.KEYWORD, keyword)
	}

	_searchByKeyword(keyword: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		let ks = handleSearchText(toHalfWidthLocaleLowerCase(keyword))
			.replace(/([\.\?])+/g, '$1')
			.split(/[\s　#\-,@]+/)
			.map(function (v: string)
			{
				return v
					.replace(/^[\/\\\+\!\?\*\.\[\]=<>]$/, '')
					;
			})
			.filter(function (v)
			{
				return v;
			})
		;

		ks = array_unique(ks);

		this._searchStatReset();
		_this.cur_keyword = keyword;

		if (ks.length)
		{
			//console.info(keyword, ks);

			this._ga(EnumEventAction.SEARCH, EnumEventLabel.KEYWORD, keyword);

			try
			{
				const r = zhRegExpGreedy(ks, 'i');

				console.info('_searchByKeyword', r);

				_this.cur_len = 0;

				let ls = Object.entries(NovelData.alias)
					.reduce(function (ls, [title, list])
					{
						if (r.test(title))
						{
							// @ts-ignore
							ls.push(...list);
						}

						return ls;
					}, [] as IFilterNovelData[]);

				ls = array_unique(ls);

				this._searchUpdateRouter(EnumEventLabel.KEYWORD, keyword);

				if (ls !== _this.novels_all)
				{
					this._updateList(array_unique(ls))
				}
			}
			catch (e)
			{

			}
		}
		else if (_this.novels_all !== NovelData.novels)
		{
			this._updateList(NovelData.novels)
		}
	}

	searchItemOptions(type: EnumEventLabel): IVChipTagOptions
	{
		if (type == EnumEventLabel.TAG)
		{
			return {
				isSelected(item: IVChipTagItem, value): boolean
				{
					//console.log('searchItemOptions:isSelected', item, value);

					if (Array.isArray(value))
					{
						return (value as any as string[]).includes(item.value)
					}
					else if (value != null && value == item.value)
					{
						return true;
					}
				},
			}
		}
	}

	_searchResetTag2(item, value)
	{
		//console.log('_searchResetTag2', item, value);

		if (!item)
		{
			this._searchResetTag();
		}
		else if (Array.isArray(value))
		{
			let iv = item.value;
			let ivr = zhRegExpGreedyMatchWords(iv);

			if (!ivr || typeof ivr === 'string')
			{
				ivr = null;
			}

			value = value.filter(v =>
			{
				let bool = v != iv;

				if (bool && ivr)
				{
					bool = !(ivr as RegExp).test(v)
				}

				return bool;
			});

			if (value.length)
			{
				this._searchByTag(value)
			}
			else
			{
				this._searchResetTag();
			}
		}
		else
		{
			this._searchResetTag();
		}
	}

	_searchByTag2(item, value: string | string[])
	{
		//console.log('_searchByTag', item, value);

		if (!value)
		{
			value = [];
		}
		else if (!Array.isArray(value))
		{
			value = value ? [value] : [];
		}

		if (Array.isArray(value))
		{
			// @ts-ignore
			this._searchByTag([...value].concat(item.value));
		}
	}

	_searchByTag(value: string | string[])
	{
		let _old_tags: string[] = [];
		let _all_tags: string[] = [];

		this.__searchBy001({
			searchType: EnumEventLabel.TAG,
			searchValue: value,

			handleValue(value)
			{
				if (value && value.length)
				{
					// @ts-ignore
					let ret = Array.isArray(value) ? value : String(value).split(',');

					return array_unique(ret).filter(v => v != null)
				}
			},

			handleData(v, k)
			{
				return k;
			},

			handleKeyword(value, k)
			{
				return Array.isArray(k) && (k as string[]).join(',') || value
			},

			data_cur_key: 'cur_tag',

			onPreCheck(cache): boolean
			{
				let bool = cache.keyword && cache.keyword.length && true;

				if (Array.isArray(cache.keyword))
				{
					_old_tags = (cache.keyword as string[]).slice();

					cache.keyword = array_unique((cache.keyword as string[]).map(function (v)
					{
						return zhRegExpGreedyMatchWords(v)
					})) as any;

					//console.log('_searchByTag', 1, _old_tags, cache.keyword);
				}

				return bool
			},

			eachFilter(novel: IFilterNovelData, cache,
			): boolean
			{
				if (
					novel.mdconf.novel
					&& novel.mdconf.novel.tags
					&& novel.mdconf.novel.tags.length
				)
				{
					if (Array.isArray(cache.keyword))
					{
						return (cache.keyword as string[]).every(v =>
						{

							let bool: boolean;

							if (typeof v === 'string')
							{
								bool = novel.mdconf.novel.tags.includes(v);
							}
							else if (v)
							{
								bool = novel.mdconf.novel.tags
									.some(s =>
									{
										let bool = (v as RegExp).test(s);

										if (bool)
										{
											_all_tags.push(s);
										}

										return bool;
									})
								;
							}

							return bool;
						})
					}
					else
					{
						return novel.mdconf.novel.tags.includes(cache.keyword)
					}
				}
			},
		});

		if (_old_tags && _old_tags.length && _all_tags && _all_tags.length)
		{
			_all_tags = array_unique(_all_tags);

			// @ts-ignore
			this.cur_tag = _all_tags;

			//console.log('_searchByTag', 2, _old_tags, _all_tags);
		}
	}

	_searchByAuthor(value: string)
	{
		return this.__searchBy001({
			searchType: EnumEventLabel.AUTHOR,
			searchValue: value,

			data_cur_key: 'cur_author',

			eachFilter(novel: IFilterNovelData, cache,
			): boolean
			{
				if (
					novel.mdconf.novel
					&& novel.mdconf.novel.authors
					&& novel.mdconf.novel.authors.length
					// @ts-ignore
					&& novel.mdconf.novel.authors.includes(cache.keyword)
				)
				{
					return true;
				}
			},
		});
	}

	/**
	 * 由於實際上 eventValue 只能是數字 所以只好放棄 eventCategory
	 * @private
	 */
	_ga(eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string | number)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue as string)
	}

	_searchByContribute(value: string)
	{
		return this.__searchBy001({
			searchType: EnumEventLabel.CONTRIBUTE,
			searchValue: value,

			data_cur_key: 'cur_contribute',

			eachFilter(novel: IFilterNovelData, cache,
			): boolean
			{
				if (
					novel.mdconf.novel
					&& novel.mdconf.contribute
					&& novel.mdconf.contribute.length
					&& novel.mdconf.contribute.includes(cache.keyword)
				)
				{
					return true;
				}
			},
		});
	}

	_searchResetTag(data?)
	{
		this._searchReset(EnumEventLabel.TAG)
	}

	_searchResetAuthor(data?)
	{
		this._searchReset(EnumEventLabel.AUTHOR)
	}

	_searchResetContribute(data?)
	{
		this._searchReset(EnumEventLabel.CONTRIBUTE)
	}

	@Watch('searchOptions.novel_status')
	@Watch('searchOptions.novel_status_value')
	onWatchFilter()
	{
		let old = this.$session.get('searchOptions');

		if (old.novel_status)
		{
			this.$session.set('searchOptions', this.searchOptions);

			this.onRouterChanged(this.$route);
			this.watchSort();
		}
		else if (this.searchOptions.novel_status)
		{
			this.watchSort();
		}

		// @ts-ignore
		this.$session.set('searchOptions', this.searchOptions)
	}

	@Watch('searchOptions.update_date')
	@Watch('searchOptions.update_date_reverse')
	@Watch('searchOptions.segment_date')
	@Watch('searchOptions.segment_date_reverse')
	@Watch('searchOptions.epub_date')
	@Watch('searchOptions.epub_date_reverse')
	@Watch('searchOptions.chapter')
	@Watch('searchOptions.chapter_reverse')
	@Watch('searchOptions.volume')
	@Watch('searchOptions.volume_reverse')
	@Watch('searchOptions.title')
	@Watch('searchOptions.title_reverse')
	watchSort()
	{
		let bool = this._updateSort();

		this.updateResource(this.page);

		if (bool)
		{
			// @ts-ignore
			this._ga('options', EnumEventAction.SEARCH, JSON.stringify(this.searchOptions));
		}

		// @ts-ignore
		this.$session.set('searchOptions', this.searchOptions)
	}

	_updateSort(ls?: IFilterNovelDataPlus[] | IFilterNovelData[], noUpdateAll?: boolean)
	{
		// @ts-ignore
		let _this = this;

		// @ts-ignore
		ls = (ls || _this.novels_all);

		if (ls && ls.length)
		{
			if (this.searchOptions.novel_status)
			{
				let flags = this.searchOptions.novel_status_value;
				ls = ls.filter(function (a)
				{
					return (a.mdconf.novel && flags &&
						(a.mdconf.novel.novel_status & flags) === flags
					)
				});
			}

			ls = ls.sort(sortSeriesCallback<IFilterNovelDataPlus>([

				_this.searchOptions.update_date && function (a, b): number
				{
					if (_this.searchOptions.update_date_reverse)
					{
						[a, b] = [b, a];
					}

					let n = (b.update_date) - (a.update_date);

					return n
				},

				_this.searchOptions.epub_date && function (a, b): number
				{
					if (_this.searchOptions.epub_date_reverse)
					{
						[a, b] = [b, a];
					}

					let n = (b.epub_date || 0) - (a.epub_date || 0);

					return n
				},

				_this.searchOptions.segment_date && function (a, b): number
				{
					if (_this.searchOptions.segment_date_reverse)
					{
						[a, b] = [b, a];
					}

					let n = (b.segment_date || 0) - (a.segment_date || 0);

					return n
				},

				_this.searchOptions.title && function (a, b): number
				{
					if (_this.searchOptions.title_reverse)
					{
						[a, b] = [b, a];
					}

					return cacheSortCallback(a.mdconf.novel && a.mdconf.novel.title || '', b.mdconf.novel && b.mdconf.novel.title || '')
				},

				_this.searchOptions.volume && function (a, b): number
				{
					if (_this.searchOptions.volume_reverse)
					{
						[a, b] = [b, a];
					}

					let n = (b.cache.volume || 0) - (a.cache.volume || 0);

					return n
				},

				_this.searchOptions.chapter && function (a, b): number
				{
					if (_this.searchOptions.chapter_reverse)
					{
						[a, b] = [b, a];
					}

					let n = (b.cache.chapter || 0) - (a.cache.chapter || 0);

					return n
				},

				function (a, b): number
				{
					return a._index - b._index
				},
			]));

			if (!noUpdateAll)
			{
				// @ts-ignore
				if (ls !== _this.novels_all)
				{
					// @ts-ignore
					_this.novels_all = ls;
				}
			}

			return ls;
		}
	}

	_updateList(ls: IFilterNovelData[])
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		if (ls !== _this.novels_all)
		{
			// @ts-ignore
			this._updateSort(ls);

			_this.cur_len = 0;
			_this.page = 1;
			// @ts-ignore
			_this.novels_all = ls;

			this.updateResource(_this.page)
		}
		else if (!_this.cur_len)
		{
			// @ts-ignore
			this._updateSort(ls);

			this.updateResource(_this.page)
		}
	}

	_pageList(self: {
		page: number,
	})
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		let page_size: number = _this.page_size;

		_this.pages = Math.ceil(_this.novels_all.length / page_size);

		if (_this.pageInit | 0)
		{
			self.page = _this.pageInit | 0;
			_this.pageInit = null;
		}

		self.page = Math.min(Math.max((self.page) | 0, 1), _this.pages);

		let idx = (self.page - 1) * page_size;

		_this.novels = _this.novels_all.slice(idx, idx + page_size);
		_this.page = self.page;

		_this.cur_author_list = [];
		_this.tags = [];
		_this.contributes = [];

		_this.novels.forEach(function (data)
		{
			let _o = new NodeNovelInfo(data.mdconf);

			_this.tags.push(..._o.tags());
			_this.cur_author_list.push(..._o.authors());
			_this.contributes.push(..._o.contributes());
		});

		_this.cur_author_list = array_unique(_this.cur_author_list).sort(cacheSortCallback);
		_this.tags = array_unique(_this.tags).sort(cacheSortCallback);
		_this.contributes = array_unique(_this.contributes).sort(cacheSortCallback);

		setTimeout(() =>
		{
			this._updateRouterPage();
		}, 500);

		this._updateTitle();

		return _this.novels;
	}

	img_unsplash(data: IFilterNovelData)
	{
		let img = lowSrcMap.get(data);

		if (!img)
		{
			img = img_unsplash();
			lowSrcMap.set(data, img);
		}

		return img
	}

	imageError(...data)
	{
		//console.log('imageError', data, this);
	}

	imageLoaded(...data)
	{
		//console.log('imageLoaded', data, this);
	}

	pagePrev()
	{
		this.pageGo(-1)
	}

	pageNext()
	{
		this.pageGo(1)
	}

	pageGo(p: number)
	{
		this.updateResource(this.page + p)
	}

	updateResource(page: number)
	{
		// @ts-ignore
		let self = this as ReturnType<List["data"]>;

		self.cur_len = 0;

		self.novels = this._pageList({
			page,
			//page_size: self.page_size,
		});

		this.$nextTick(() =>
		{
			/**
			 * 利用 v-if 來強制刷新物件 避免 image 沒有更新的 BUG
			 */
			self.cur_len = self.novels.length
		});
	}

}
</script>

<style scoped lang="scss">
.text-overflow-ellipsis {
	text-overflow: ellipsis;
}

.my-novel {
	.my-novel-tag {
		opacity: 0.7;
	}

	&:hover {
		.my-novel-tag {
			opacity: 1;
		}
	}
}

.v-card--reveal {
	align-items: center;
	bottom: 0;
	justify-content: center;
	opacity: .8;
	position: absolute;
	width: 100%;
}

.pre-wrap {
	white-space: pre-wrap;
}

.pagination-div {
	text-align: center;
}

</style>
<style lang="scss">
.v-input__slot, .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
	margin-bottom: 0;
}

.novel_status-area {
	.v-expansion-panel__header {
		max-width: unset;
		padding: 0;
	}

	.v-expansion-panel__container {
		max-width: unset;
	}

	.v-expansion-panel__container--active, .v-expansion-panel__container--active {
		margin: 0;
	}
}
</style>
