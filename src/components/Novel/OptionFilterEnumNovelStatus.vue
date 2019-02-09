<template>
	<root v-model="value">
		<v-checkbox v-for="item in items" class="shrink my-0 mr-2"
								v-model="inputValues"
								:label="item.label"
								:value="item.value"
		></v-checkbox>
	</root>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { EnumNovelStatus } from 'node-novel-info/lib/const'

@Component
export default class OptionFilterEnumNovelStatus extends Vue
{
	name = OptionFilterEnumNovelStatus;

	@Prop({
		type: Number,
		default: 768,
	})
	value: EnumNovelStatus;

	items = this.__my_list();

	inputValues: EnumNovelStatus[] = [];

	EnumNovelStatus = EnumNovelStatus;

	mounted()
	{
		this.$nextTick(() => this.onValue(null))
	}

	__my_list()
	{
		return Object.entries(EnumNovelStatus)
			.reduce((a, b) =>
			{
				let [k, v] = b;

				if (typeof v === 'number' && v)
				{
					a.push({
						label: this.__my_i18n(k, v),
						value: v,
					});
				}

				return a;
			}, [])
	}

	__my_i18n(k: keyof EnumNovelStatus, v: EnumNovelStatus)
	{
		switch (v)
		{
			case EnumNovelStatus.AUTHOR_DONE:
				return '作者已完結';
			case EnumNovelStatus.AUTHOR_NOUPDATE:
				return '作者已棄坑';
			case EnumNovelStatus.AUTHOR_DELETE:
				return '作者已刪除';
			case EnumNovelStatus.AUTHOR_DEAD:
				return '作者已過世';

			case EnumNovelStatus.USER_DONE:
				return '搬運完結 並且處理完畢';
			case EnumNovelStatus.USER_NOUPDATE:
				return '搬運棄坑';
			case EnumNovelStatus.USER_TODO:
				return '搬運完結 但未整理';

			case EnumNovelStatus.P_BOOK:
				return '文庫化';
			case EnumNovelStatus.P_COMIC:
				return '漫畫化';
			case EnumNovelStatus.P_ANIME:
				return '動畫化';
			case EnumNovelStatus.P_GAME:
				return '遊戲';

			case EnumNovelStatus.P_DIGITAL:
				return '數位/電子書';
			case EnumNovelStatus.P_MOVIE:
				return '電影';
			case EnumNovelStatus.P_REAL:
				return '真人/舞台';
			case EnumNovelStatus.P_PRINT:
				return '自印/同人';

			default:
				return k;
		}
	}

	@Watch('value')
	onValue(old)
	{
		let value = this.value;

		let inputValues = Object.values(EnumNovelStatus)
			.reduce(function (a, b)
			{
				if (typeof b === 'number' && value & b)
				{
					a.push(b)
				}

				return a;
			}, []);

		this.inputValues = inputValues;
		this.$emit('input', this.value);
	}

	@Watch('inputValues')
	onInput(...argv)
	{
		this.value = (this.inputValues || []).reduce(function (a, b)
		{
			return a | b;
		}, 0);
	}
}
</script>

<style scoped lang="scss">

</style>
