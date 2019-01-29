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

				<div>
					<v-pagination
						:length="pages"
						:value="page"
						:total-visible="7"
						circle
						@input="updateResource"
					></v-pagination>
				</div>

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
															>{{ item.mdconf.novel.author }}
															</v-chip>

															<v-chip
																small
																class="text-xs-right caption"
																label
																color="purple darken-4" text-color="white"

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
																<span v-text="item.novelID"></span>
															</v-flex>
														</v-layout>
													</v-container>


													<div slot="default">
														<div v-for="title in getNovelTitleFromMeta(item.mdconf, item.novelID)">
															{{ title }}
														</div>
													</div>

												</v-tooltip>

											</a>


										</v-flex>

									</v-layout>
								</v-card>

							</v-hover>


						</v-flex>

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
						@input="_searchResetKeyword"
					>
						NONE
					</v-alert>
				</v-container>

				<v-progress-circular
					v-else
					indeterminate
					color="purple"
				></v-progress-circular>

				<div>
					<v-pagination
						:length="pages"
						:value="page"
						:total-visible="7"
						circle
						@input="updateResource"
					></v-pagination>
				</div>

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
				@change="_searchByKeyword"
				@click:clear="_searchResetKeyword"

				@keyup.left="_stopEvent"
				@keyup.right="_stopEvent"

				@keyup.page-up="_stopEvent"
				@keyup.page-down="_stopEvent"

			></v-text-field>

		</Topbar>

		<!--v-toolbar
			app
			height="40" :clipped-left="$vuetify.breakpoint.lgAndUp"
			fixed
		>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
				<router-link to="/" class="text-color-inherit top-bar-header-title">Novel</router-link>
			</v-toolbar-title>

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
				@change="_searchByKeyword"
				@click:clear="_searchResetKeyword"

				@keyup.left="_stopEvent"
				@keyup.right="_stopEvent"

				@keyup.page-up="_stopEvent"
				@keyup.page-down="_stopEvent"

			></v-text-field>

			<v-spacer />

			<v-toolbar-items>

				<NavToolbarItems></NavToolbarItems>


			</v-toolbar-items>


		</v-toolbar-->

		<v-navigation-drawer
			:clipped="$vuetify.breakpoint.lgAndUp"
			app
			v-model="drawer"
		>

			<PanelFilterTag3
				title="Tag"

				icon="label"

				:items="tags"
				:value="cur_tag"

				:itemOptions="searchItemOptions('tag')"

				@click="_searchByTag2"
				@reset="_searchResetTag2"
			></PanelFilterTag3>

			<!--PanelFilterTag
				title="Tag"

				icon="label"

				:items="tags"
				:value="cur_tag"

				@click="_searchByTag"
				@reset="_searchResetTag"
			></PanelFilterTag-->

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

import {
	cacheSortCallback,
	dataAll,
	EnumEventAction,
	EnumEventLabel,
	getNovelTitleFromMeta,
	IFilterNovelData,
	novelLink,
	} from '@/lib/novel';
import { img_unsplash } from '@/lib/util';
import { IVueComponent } from '@/lib/vue/index';
import { array_unique } from 'array-hyper-unique'
import url from 'url';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router'
import { toHalfWidthLocaleLowerCase, handleSearchText } from '@/lib/conv';
import { getZhRegExp, zhRegExpGreedy, zhRegExpGreedyMatchWords } from '@/lib/regexp';

const NovelData = dataAll();

const lowSrcMap = new WeakMap();

@Component({
	components: {
		NavToolbarItems,
		Topbar,
		PanelFilterTag,
		PanelFilterTag2,
		PanelFilterTag3,
	},
})
export default class List extends Vue
{
	//$ga: IVueAnalytics$ga;

	page: number;
	drawer: boolean;

	data()
	{
		let page_size = 12;
		let page = 1;

		let chapter_range: unknown[] = [];

		{
			let len = Math.ceil(NovelData.max_chapter / 100);

			let size = (len * 100).toString().length;

			while (len--)
			{
				chapter_range[len] = (len + 1) * 100;
			}

			chapter_range.unshift(50);
			chapter_range.unshift(20);
			chapter_range.unshift(10);
			chapter_range.unshift(5);
			chapter_range.unshift(0);

			let ls = [];

			[0].concat(chapter_range as number[]).reduce(function (p, value)
			{

				ls.push({
					value,
					min: p,
					label: `${String(p).padStart(size, '0')}-${String(value).padStart(size, '0')}`,
				});

				return value + 1;
			});

			chapter_range = ls;
		}

		let data = {
//			dialog: false,
			drawer: false,

			cur_len: 0,
			page_size,
			novels: [] as typeof NovelData["novels"],
			page,
			pages: 1,

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

			cur_title: '',
			title: '',

			cur_publisher: '',
			publishers: NovelData["publishers"],

			cur_illust: '',
			illusts: NovelData["illusts"],
		};

		this._data_init();

		return data;
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

		// @ts-ignore
		if (this.$route.params.searchType)
		{
			setTimeout(() => this.onRouterChanged(this.$route, null), 250);
		}
		else
		{
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
			keyword2 = (handleKeyword ? handleKeyword : handleValue)(searchValue, keyword);
		}
		else
		{
			keyword2 = searchValue;
		}

		let keyword3;

		if (handleData || handleKeyword || handleValue)
		{
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

		if (!onPreCheck || onPreCheck && (onPreCheckReturn = onPreCheck(_cache)))
		{
			let cache = NovelData.novels
				.reduce(function (cache, novel)
				{
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

	_searchUpdateRouter(searchType: EnumEventLabel, searchValue: string | number)
	{
		//console.log('_searchUpdateRouter', searchType, searchValue);

		if (searchValue)
		{
			let q = this._queryParams(this.$route);

			if (q.searchType !== searchType || q.searchValue != searchValue)
			{
				this.$router.push({
					//path: `/${EnumEventAction.SEARCH}/${searchType}?searchValue=${searchValue || ''}`,

					path: `/${EnumEventAction.SEARCH}/${searchType}`,
					query: {
						searchValue: searchValue as string || '',
					},
				});
			}
		}
		else
		{
			this.$router.push({
				path: `/`,
			});
		}
	}

	novelLink(data: IFilterNovelData)
	{
		let link = novelLink(data.pathMain, data.novelID);

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

	_searchResetKeyword()
	{
		this._searchReset(EnumEventLabel.KEYWORD)
	}

	beforeRouteUpdate(to, from, next)
	{
		console.log('beforeRouteUpdate', to, from, next);
		next();
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

			value = value.filter(v => {
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
						return (cache.keyword as string[]).every(v => {

							let bool: boolean;

							if (typeof v === 'string')
							{
								bool = novel.mdconf.novel.tags.includes(v);
							}
							else if (v)
							{
								bool = novel.mdconf.novel.tags
									.some(s => {
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

	_updateList(ls: IFilterNovelData[])
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		if (ls !== _this.novels_all)
		{
			_this.cur_len = 0;
			_this.page = 1;
			_this.novels_all = ls;

			this.updateResource(_this.page)
		}
		else if (!_this.cur_len)
		{
			this.updateResource(_this.page)
		}
	}

	_pageList(self: {
		page: number,
		page_size: number,
	})
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.pages = Math.ceil(_this.novels_all.length / self.page_size);

		self.page = Math.min(Math.max((self.page) | 0, 1), _this.pages);

		let idx = (self.page - 1) * self.page_size;

		_this.novels = _this.novels_all.slice(idx, idx + self.page_size);
		_this.page = self.page;

		{
			let ls = _this.novels.reduce(function (ls, data)
			{
				if (data.mdconf.novel && data.mdconf.novel.tags && data.mdconf.novel.tags.length)
				{
					ls.push(...data.mdconf.novel.tags);
				}

				return ls;
			}, []);

			_this.tags = array_unique(ls).sort(cacheSortCallback);
		}

		{
			let ls = _this.novels.reduce(function (ls, data)
			{
				if (data.mdconf.contribute && data.mdconf.contribute.length)
				{
					ls.push(...data.mdconf.contribute);
				}

				return ls;
			}, []);

			_this.contributes = array_unique(ls).sort(cacheSortCallback);
		}

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
			page_size: self.page_size,
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

</style>
