<template>
	<v-expansion-panel
		expand
		focusable
	>
		<v-expansion-panel-content>
			<div slot="header">
				<v-chip
					class="caption"
					small
					label
					:selected="hasValue = _hasValue()"
					:close="hasValue"
					:color="hasValue ? 'pink' : ''"
					:text-color="hasValue ? textColor : ''"
					@input="onReset()"
				>
					<v-icon left v-if="icon">{{ icon }}</v-icon>
					{{ title }}
				</v-chip>

			</div>
			<v-card v-if="items.length">
				<v-card-text expand>
					<VChipTag
						v-for="itemv in items"
						v-bind:key="toItem(itemv).label"
						:item="toItem(itemv)"
						:value="value"
						@click="onClick"
						@reset="onReset"
						:opts="itemOptions"
					></VChipTag>
				</v-card-text>
			</v-card>
			<v-alert
				v-else
				:value="true"
				type="error"
				class="pa-1 ma-0"
			>
				NONE
			</v-alert>
		</v-expansion-panel-content>

	</v-expansion-panel>
</template>

<script lang="ts">
import { Component, Prop, Vue, Prop, Watch } from 'vue-property-decorator';
import VChipTag from '@/components/Novel/VChipTag.vue';
import { IVChipTagItem, IVChipTagOptions } from '@/components/Novel/VChipTag.vue';

export { IVChipTagItem, IVChipTagOptions }

@Component({
	components: {
		VChipTag,
	},
})
export default class PanelFilterTag3<V extends any, IV extends any> extends Vue
{
	@Prop({
		type: String,
		default: '',
	})
	icon?: string;
	@Prop({
		type: String,
		default: '',
	})
	itemIcon?: string;
	@Prop(String)
	title: string;
	@Prop({
		default: '',
	})
	value?: V;
	@Prop({
		type: Array,
		default: [] as IV[],
	})
	items: IV[];

	@Prop({
		type: String,
		default: 'white',
	})
	textColor?: string;
	@Prop({
		type: String,
		default: 'pink',
	})
	color?: string;

	@Prop({
		default()
		{
			return {}
		},
	})
	opts?: {
		hasValue?(value?: V): boolean,
		toItem?(item: IV | IVChipTagItem<IV>): IVChipTagItem<IV>,
	};

	protected hasValue?: boolean = false;

	@Prop({
		default()
		{
			return {}
		},
	})
	itemOptions: IVChipTagOptions<V, IV>;

	toItem(item: IV | IVChipTagItem<IV>): IVChipTagItem<IV>
	{
		if (this.opts && this.opts.toItem)
		{
			return this.opts.toItem(item)
		}
		else if (typeof item == 'object' && ('value' in item) && ('label' in item))
		{
			return item
		}

		return {
			value: item as IV,
			label: String(item),
		}
	}

	_hasValue()
	{
		let bool: boolean;

		if (this.opts && this.opts.hasValue)
		{
			bool = this.opts.hasValue(this.value);
		}
		else if (Array.isArray(this.value))
		{
			bool = this.value.length;
		}
		else
		{
			bool = this.value != null && this.value
		}

		return this.hasValue = !!bool
	}

	onReset(item?: IVChipTagItem<IV>)
	{
		this.$emit('reset', item, this.value)
	}

	onClick(item?: IVChipTagItem<IV>)
	{
		this.$emit('click', item, this.value);
	}
}
</script>

<style scoped lang="scss">

</style>
