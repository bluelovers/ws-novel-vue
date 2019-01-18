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
					:selected="!!value"
					:close="!!value"
					:color="value ? 'pink' : ''"
					:text-color="value ? textColor : ''"
					@input="onReset"
				>
					<v-icon left v-if="icon">{{ icon }}</v-icon>
					{{ title }}
				</v-chip>

			</div>
			<v-card v-if="items.length">
				<v-card-text expand>
					<v-chip v-for="item in items" class="caption" @click="onClick(item)"
							small
							:selected="item.value == value"
							:close="item.value == value"
							@input="onReset"
							label
							:color="item.value == value ? 'pink' : ''"
							:text-color="item.value == value ? textColor : ''"
					>
						<v-icon left v-if="item.value == value">{{ itemIcon || icon || 'label' }}</v-icon>
						{{ item.label }}
					</v-chip>
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
import { Component, Prop, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PanelFilterTag extends Vue
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
		type: String,
		default: '',
	})
	value?: string;
	@Prop({
		type: Array,
		default: [],
	})
	items: {
		value,
		label: string
	}[];

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

	onReset()
	{
		let old = this.value;
		this.value = null;

		//console.log('reset', this.value, old);
		this.$emit('reset', this.value, old)
	}

	onClick(cur_item_value)
	{
		let old = this.value;
		this.value = cur_item_value;

		//console.log('click', this.value, old);

		this.$emit('click', this.value, old);
	}
}
</script>

<style scoped lang="scss">

</style>
