<template>

	<v-container fluid grid-list-md>

		<v-container row wrap>
			<v-switch :label="opt_tw2cn ? 'tw2cn' : 'cn2tw'" v-model="opt_tw2cn"></v-switch>
			<v-checkbox label="min mode" v-model="opt_minmode"></v-checkbox>
		</v-container>

		<v-layout row wrap>
			<v-flex>
				<v-textarea
					class="caption"
					outline
					auto-grow
					autofocus
					clearable
					counter
					:rows="rows"
					:loading="loading"
					prepend-inner-icon="translate"
					label="Input textarea"
					:value="value_input"
					persistent-hint
					placeholder="待轉換的文字"

					@change="onChange"
					@input="onInput"
				></v-textarea>
			</v-flex>
			<v-flex>
				<v-textarea
					class="caption"
					outline
					auto-grow
					autofocus
					clearable
					counter
					:rows="rows"
					:loading="loading"
					prepend-inner-icon="subject"
					label="Output textarea"
					:value="value_output"
					persistent-hint
					placeholder="轉換後的文字"
				></v-textarea>
			</v-flex>
		</v-layout>
	</v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { tw2cn, cn2tw } from 'cjk-conv/lib/zh/convert';
import { tw2cn_min, cn2tw_min } from 'cjk-conv/lib/zh/convert/min';

@Component
export default class CjkConv extends Vue {
	loading = false;

	rows = 10;

	value_input = '';
	value_output = '';

	opt_tw2cn = false;
	opt_minmode = true;

	runConv(text: string)
	{
		this.loading = true;

		if (text)
		{
			let fn;

			if (this.opt_minmode)
			{
				fn = this.opt_tw2cn ? tw2cn_min : cn2tw_min;
			}
			else
			{
				fn = this.opt_tw2cn ? tw2cn : cn2tw;
			}

			const old = text;

			text = fn(text);
		}

		this.value_output = text;

		this.loading = false;
	}

	@Watch('opt_minmode')
	@Watch('opt_tw2cn')
	onWatchChange()
	{
		this.runConv(this.value_input);
	}

	onInput(text?: string)
	{
		text = (text || '')
			.replace(/^[\r\n]+/g, '')
		;

		if (!text)
		{
			this.value_input = '';
			this.onWatchChange();
		}
	}

	onChange(text: string)
	{
		let old = this.value_input;
		text = this.value_input = text
			.replace(/^[\r\n]+/g, '')
		;

		if (old != text || text == '')
		{
			this.runConv(text);
		}

	}
}
</script>

<style scoped lang="scss">

</style>
