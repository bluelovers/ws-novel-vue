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
					<v-chip v-for="name in items" class="caption" @click="onClick(name)"
							small
							:selected="name === value"
							:close="name === value"
							@input="onReset"
							label
							:color="name === value ? 'pink' : ''"
							:text-color="name === value ? textColor : ''"
					>
						<v-icon left v-if="name === value">{{ itemIcon || icon || 'label' }}</v-icon>
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PanelFilterTag extends Vue {
	@Prop(String)
	icon?: string;
	@Prop(String)
	itemIcon?: string;
	@Prop(String)
	title: string;
	@Prop(String)
	value?: string;
	@Prop(Array)
	items: string[];

	@Prop(String)
	textColor?: string;
	@Prop(String)
	color?: string;

	data()
	{
		return {
			icon: '',
			itemIcon: '',
			title: '',
			value: '',
			items: [] as string[],
			textColor: 'white',
			color: 'pink',
		}
	}

	onReset()
	{
		let old = this.value;
		this.value = '';

		//console.log('reset', this.value, old);
		this.$emit('reset', this.value, old)
	}

	onClick(cur_item_value: string)
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
