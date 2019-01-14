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

				{{ query }}

				<v-container
					v-if="cur_len"
					v-bind="{ [`grid-list-${size}`]: true }"
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

		<v-toolbar
			app
			height="40" :clipped-left="$vuetify.breakpoint.lgAndUp"
			fixed
		>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
				<router-link to="/" class="text-color-inherit">Novel</router-link>
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


		</v-toolbar>

		<v-navigation-drawer
			:clipped="$vuetify.breakpoint.lgAndUp"
			app
			v-model="drawer"
		>

			<v-expansion-panel
				expand
			>
				<v-expansion-panel-content>
					<div slot="header">Tags</div>
					<v-card v-if="tags.length">
						<v-card-text expand>
							<v-chip v-for="name in tags" class="caption" @click="_searchByTag(name)"
									small
									:selected="name === cur_tag"
									:close="name === cur_tag"
									@input="_searchResetTag"
									label
									:color="name === cur_tag ? 'pink' : ''"
									:text-color="name === cur_tag ? 'white' : ''"
							>
								<v-icon left v-if="name === cur_tag">label</v-icon>
								{{ name }}
							</v-chip>
						</v-card-text>
					</v-card>
					<v-container v-else>
						<v-alert
							:value="true"
							type="error"
						>
							NONE
						</v-alert>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel
				expand
			>
				<v-expansion-panel-content>
					<div slot="header">Authors</div>
					<v-card v-if="authors.length">
						<v-card-text expand>
							<v-chip v-for="name in authors" class="caption" @click="_searchByAuthor(name)"
									small
									:selected="name === cur_author"
									:close="name === cur_author"
									@input="_searchResetAuthor"
									label
									:color="name === cur_author ? 'pink' : ''"
									:text-color="name === cur_author ? 'white' : ''"
							>
								<v-icon left v-if="name === cur_author">label</v-icon>
								{{ name }}
							</v-chip>
						</v-card-text>
					</v-card>
					<v-container v-else>
						<span>NONE</span>
					</v-container>
				</v-expansion-panel-content>

			</v-expansion-panel>

			<v-expansion-panel
				expand
			>
				<v-expansion-panel-content>
					<div slot="header">Contributes</div>
					<v-card v-if="contributes.length">
						<v-card-text expand>
							<v-chip v-for="name in contributes" class="caption" @click="_searchByContribute(name)"
									small
									:selected="name === cur_contribute"
									:close="name === cur_contribute"
									@input="_searchResetContribute"
									label
									:color="name === cur_contribute ? 'pink' : ''"
									:text-color="name === cur_contribute ? 'white' : ''"
							>
								<v-icon left v-if="name === cur_contribute">label</v-icon>
								{{ name }}
							</v-chip>
						</v-card-text>
					</v-card>
					<v-container v-else>
						<span>NONE</span>
					</v-container>
				</v-expansion-panel-content>

			</v-expansion-panel>

		</v-navigation-drawer>

	</v-container>

</template>

<script lang="ts">
import { IVueAnalytics$ga } from '@/plugins/vue-analytics';
import { array_unique } from 'array-hyper-unique'
import url from 'url';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router'
import StrUtil from 'str-util';
import { IVueComponent } from '@/lib/vue/index';

import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'

import {
	dataAll,
	EnumEventAction,
	EnumEventLabel,
	IFilterNovelData,
	toHalfWidthLocaleLowerCase,
	NovelInfo,
	getNovelTitleFromMeta,
} from '@/lib/novel';
import { img_unsplash } from '@/lib/util';

const NovelData = dataAll();

const lowSrcMap = new WeakMap();

@Component({
	components: {
		NavToolbarItems,
	},
})
export default class List extends Vue
{
	//$ga: IVueAnalytics$ga;

	page: number;

	data()
	{
		let page_size = 12;
		let page = 1;

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

			novels_all: NovelData.novels,

			cur_keyword: '',
			cur_tag: '',
			cur_contribute: '',
			cur_author: '',

			cur_title: '',
			title: '',
		};

		this._data_init();

		return data;
	}

	getNovelTitleFromMeta(mdconf, novelID?)
	{
		let ls =  getNovelTitleFromMeta(mdconf, novelID)
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
			default:
				throw new TypeError(`searchType not exists: ${searchType}`)
		}

		this._setTitle([searchValue, searchType]);
	}

	_searchReset(searchType: EnumEventLabel)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		this._searchStatReset();

		_this.cur_len = 0;

		this._updateList(NovelData.novels);

		this._searchUpdateRouter(EnumEventLabel.KEYWORD, '')
	}

	_searchUpdateRouter(searchType: EnumEventLabel, searchValue: string)
	{
		if (searchValue)
		{
			let q = this._queryParams(this.$route);

			if (q.searchType !== searchType || q.searchValue != searchValue)
			{
				this.$router.push({
					//path: `/${EnumEventAction.SEARCH}/${searchType}?searchValue=${searchValue || ''}`,

					path: `/${EnumEventAction.SEARCH}/${searchType}`,
					query: {
						searchValue: searchValue || '',
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
		return url.resolve('https://gitee.com/bluelovers/novel/tree/master/', [
			data.pathMain,
			data.novelID,
		].join('/'))
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

		let ks = toHalfWidthLocaleLowerCase(keyword)
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
				// @ts-ignore
				const zhRegExp = require('regexp-cjk').zhRegExp || RegExp as import('regexp-cjk').zhRegExp;

				const r = new zhRegExp(ks.join('|'), 'iu', {
					greedyTable: true,
				});

				//console.info(r);

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

	_searchByTag(value: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_len = 0;

		let keyword = value;

		//console.log('_searchByTag', value);

		this._searchStatReset();
		_this.cur_tag = keyword;

		this._ga(EnumEventAction.SEARCH, EnumEventLabel.TAG, keyword);

		this._searchUpdateRouter(EnumEventLabel.TAG, keyword);

		let ls = NovelData.novels
			.reduce(function (ls, novel)
			{
				if (novel.mdconf.novel && novel.mdconf.novel.tags && novel.mdconf.novel.tags.length)
				{
					if (novel.mdconf.novel.tags.includes(keyword))
					{
						ls.push(novel)
					}
				}

				return ls;
			}, [])
		;

		this._updateList(ls);
	}

	_searchStatReset()
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_tag = '';
		_this.cur_contribute = '';
		_this.cur_keyword = '';
		_this.cur_author = '';
	}

	_searchByAuthor(value: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_len = 0;

		let keyword = value;

		//console.log('_searchByContribute', value);

		this._searchStatReset();

		this._ga(EnumEventAction.SEARCH, EnumEventLabel.AUTHOR, keyword);
		this._searchUpdateRouter(EnumEventLabel.AUTHOR, keyword);

		_this.cur_author = keyword;

		let ls = NovelData.novels
			.reduce(function (ls, novel)
			{
				if (novel.mdconf.novel.author === keyword)
				{
					ls.push(novel)
				}
				else if (novel.mdconf.novel.authors && novel.mdconf.novel.authors.length && novel.mdconf.novel.authors.includes(keyword))
				{
					ls.push(novel)
				}

				return ls;
			}, [])
		;

		this._updateList(ls);
	}

	/**
	 * 由於實際上 eventValue 只能是數字 所以只好放棄 eventCategory
	 * @private
	 */
	_ga(eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue)
	}

	_searchByContribute(value: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_len = 0;

		let keyword = value;

		//console.log('_searchByContribute', value);

		this._searchStatReset();
		this._searchUpdateRouter(EnumEventLabel.CONTRIBUTE, keyword);

		_this.cur_contribute = keyword;

		this._ga(EnumEventAction.SEARCH, EnumEventLabel.CONTRIBUTE, keyword);

		let ls = NovelData.novels
			.reduce(function (ls, novel)
			{
				if (novel.mdconf.novel && novel.mdconf.contribute && novel.mdconf.contribute.length)
				{
					if (novel.mdconf.contribute.includes(keyword))
					{
						ls.push(novel)
					}
				}

				return ls;
			}, [])
		;

		this._updateList(ls);
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

			_this.tags = array_unique(ls);
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

			_this.contributes = array_unique(ls);
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
