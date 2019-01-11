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
					<v-layout row wrap>
						<v-flex
							v-for="item in novels"
							md4
							flat tile
						>

							<v-card>
								<v-layout>

									<v-flex>

										<a :href="novelLink(item)" target="_blank" rel="noopener">

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

		<v-navigation-drawer
			:clipped="$vuetify.breakpoint.lgAndUp"
			app
			v-model="drawer"
			fixed
		>
		</v-navigation-drawer>

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
				persistent-hint="true"
				@change="_searchList"
				@click:clear="_searchReset"
			></v-text-field>

			<v-toolbar-items>


				<v-spacer />
			</v-toolbar-items>


		</v-toolbar>

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

			novels_all: NovelData.novels,
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

		if (ks.length)
		{
			console.info(keyword, ks);

			try
			{
				// @ts-ignore
				const zhRegExp = require('regexp-cjk').zhRegExp || RegExp;

				const r = new zhRegExp(ks.join('|'));

				console.info(r);

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
					_this.cur_len = 0;
					_this.novels_all = array_unique(ls);
					_this.page = 1;

					this.updateResource(1)
				}
			}
			catch (e)
			{

			}
		}
		else if (_this.novels_all !== NovelData.novels)
		{
			_this.cur_len = 0;
			_this.page = 1;
			_this.novels_all = NovelData.novels;
			this.updateResource(1)
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

		return _this.novels_all.slice(idx, idx + self.page_size);
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
		console.log('imageError', data, this);
	}

	imageLoaded(...data)
	{
		console.log('imageLoaded', data, this);
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
</style>
