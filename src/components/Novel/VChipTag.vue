<template>
	<v-chip :item="item" class="caption" @click="onClickItem(item)"
			small
			:selected="selected = isSelected()"
			:close="selected"
			@input="onResetItem(item)"
			label
			:color="selected ? 'pink' : ''"
			:text-color="selected ? this.$parent.textColor : ''"
	>
		<v-icon left v-if="selected">{{ this.$parent.itemIcon|| this.$parent.icon  || 'label' }}</v-icon>
		{{ item.label }}
	</v-chip>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

export interface IVChipTagItem<T>
{
	value: T,
	label: string,
}

export interface IVChipTagOptions<V, IV>
{
	isSelected?(item: IVChipTagItem<IV>, value: V): boolean
}

@Component
export default class VChipTag<V extends any, IV extends any> extends Vue
{
	@Prop({
		default: null,
	})
	value: V;

	@Prop({
		default()
		{
			return {
				value: null,
				label: null,
			}
		},
	})
	item: IVChipTagItem<IV>;

	selected?: boolean = false;

	@Prop({
		default()
		{
			return {
			}
		},
	})
	opts?: IVChipTagOptions<V, IV>;

	isSelected()
	{
		let bool: boolean;

		let value = this.value;

		if (this.opts && this.opts.isSelected)
		{
			bool = this.opts.isSelected(this.item, value);
		}
		else
		{
			bool = value != null && value && value == this.item.value
		}

		//console.log('isSelected', bool, this.item, value, this.value);

		return this.selected = !!bool;
	}

	onClickItem(item?: IVChipTagItem<IV>)
	{
		let value = this.value;

		this.$emit('click', item, value)
	}

	onResetItem(item?: IVChipTagItem<IV>)
	{
		let value = this.value;

		this.$emit('reset', item, value)
	}
}
</script>

<style scoped lang="scss">

</style>
