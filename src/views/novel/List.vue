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

										<a :href="novelLink(item)" target="_blank">

										<v-tooltip lazy bottom>



											<v-img
												:src="item.mdconf.novel.cover"
												:lazy-src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
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
													<v-flex xs12 align-end flexbox overflow-hidden class="text-no-wrap text-overflow-ellipsis">
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

	</v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import url from 'url';

import { dataAll, IFilterNovelData } from '../../lib/novel';

const NovelData = dataAll();

@Component
export default class List extends Vue
{

	data()
	{
		let page_size = 12;
		let page = 1;

		let data = {
			cur_len: 0,
			page_size,
			novels: [] as typeof NovelData["novels"],
			page,
			pages: Math.ceil(NovelData.novels.length / page_size),
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

	_pageList(self: {
		page: number,
		page_size: number,
	})
	{
		this.page = Math.min(Math.max((self.page) | 0, 1), this.pages);

		let idx = (this.page - 1) * self.page_size;

		return NovelData.novels.slice(idx, idx + self.page_size);
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
