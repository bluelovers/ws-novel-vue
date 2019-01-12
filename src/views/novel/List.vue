<template>

	<v-container
		v-on:keyup.left="pagePrev"
		v-on:keyup.right="pageNext"
	>

		<v-layout>
			<v-flex sm6 offset-sm3>

				<div>
					<v-pagination
						v-model="page"
						:length="pages"
						:total-visible="7"
						circle
						@input="updateResource"
					></v-pagination>
				</div>

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

							<v-card>
								<v-layout>

									<v-flex>

										<a :href="novelLink(item)" target="_blank" rel="noopener" class="text-none">

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

												>
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


												<span v-text="item.novelID + ' by ' + item.mdconf.novel.author"></span>
											</v-tooltip>

										</a>


									</v-flex>

								</v-layout>
							</v-card>


						</v-flex>

					</v-layout>
				</v-container>

				<v-container v-else-if="pages == 0">
					<span>NONE</span>
				</v-container>

				<v-progress-circular
					v-else
					indeterminate
					color="purple"
				></v-progress-circular>

				<div>
					<v-pagination
						v-model="page"
						:length="pages"
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

			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<span class="hidden-sm-and-down">Novel</span>
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
				@change="_searchList"
				@click:clear="_searchReset"
			></v-text-field>

			<v-toolbar-items>


				<v-spacer />
			</v-toolbar-items>


		</v-toolbar>

		<v-navigation-drawer
			:clipped="$vuetify.breakpoint.lgAndUp"
			app
			v-model="drawer"
		>

			<v-expansion-panel
				v-model="panel"
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
									@input="_tagInput"
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
						<span>NONE</span>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<v-expansion-panel
				v-model="panel"
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
									@input="_authorInput"
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
				v-model="panel"
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
									@input="_contributeInput"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import url from 'url';
import { img_unsplash } from '../../lib/util';
import { array_unique } from 'array-hyper-unique'

import { dataAll, IFilterNovelData } from '../../lib/novel';

const NovelData = dataAll();

const lowSrcMap = new WeakMap();

@Component
export default class List extends Vue
{

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
			pages: 0,

			tags: [] as typeof NovelData["tags"],
			contributes: [] as typeof NovelData["contributes"],
			authors: NovelData["authors"],

			novels_all: NovelData.novels,

			cur_keyword: '',
			cur_tag: '',
			cur_contribute: '',
			cur_author: '',
		};

		setTimeout(() => this.updateResource(this.page), 250);

		return data;
	}

	novelLink(data: IFilterNovelData)
	{
		return url.resolve('https://gitee.com/bluelovers/novel/tree/master/', [
			data.pathMain,
			data.novelID,
		].join('/'))
	}

	_searchReset()
	{
		this._searchList('')
	}

	_searchList(keyword: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		let ks = keyword
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

		this._resetSubSearch();
		_this.cur_keyword = keyword;

		if (ks.length)
		{
			//console.info(keyword, ks);

			try
			{
				// @ts-ignore
				const zhRegExp = require('regexp-cjk').zhRegExp || RegExp;

				const r = new zhRegExp(ks.join('|'));

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

		this._resetSubSearch();
		_this.cur_tag = keyword;

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

	_resetSubSearch()
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

		this._resetSubSearch();

		_this.cur_author = keyword.trim();

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

	_searchByContribute(value: string)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		_this.cur_len = 0;

		let keyword = value;

		//console.log('_searchByContribute', value);

		this._resetSubSearch();

		_this.cur_contribute = keyword;

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

	_tagInput(data)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		if (!data)
		{
			_this.cur_tag = '';

			this._updateList(NovelData.novels);
		}
	}

	_authorInput(data)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		if (!data)
		{
			_this.cur_author = '';

			this._updateList(NovelData.novels);
		}
	}

	_contributeInput(data)
	{
		// @ts-ignore
		let _this = this as ReturnType<List["data"]>;

		if (!data)
		{
			_this.cur_contribute = '';

			this._updateList(NovelData.novels);
		}
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

		let idx = (this.page - 1) * self.page_size;

		_this.novels = _this.novels_all.slice(idx, idx + self.page_size);

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

</style>
