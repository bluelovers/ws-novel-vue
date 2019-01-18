<template>

	<v-container fluid grid-list-md>

		<v-container>
			<v-switch
				:label="'目前為 ' + (opt_tw2cn ? 'tw2cn' : 'cn2tw')" v-model="opt_tw2cn"
				class="my-0"
			>
				<v-tooltip lazy top slot="append">
					<v-icon slot="activator">help</v-icon>
					轉繁或者轉簡
				</v-tooltip>
			</v-switch>

			<v-checkbox
				label="min mode"
				v-model="opt_minmode"
				class="my-0"
			>
				<v-tooltip lazy top slot="append">
					<v-icon slot="activator">help</v-icon>
					除非有必要否則不要變動此選項
				</v-tooltip>
			</v-checkbox>

		</v-container>

		<v-layout row wrap>
			<v-flex>
				<v-textarea
					:class="`caption ${$style.mytextarea}`"
					outline
					autofocus
					clearable
					counter
					auto-grow
					:rows="rows"
					:loading="loading"
					prepend-inner-icon="translate"
					:prepend-inner-icon-cb="onWatchChange"
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
					:class="`caption ${$style.mytextarea}`"
					outline
					autofocus
					counter
					auto-grow
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

		<v-container>

			此轉換功能實現來自 <a href="https://www.npmjs.com/package/cjk-conv" target="_blank">cjk-conv</a>

		</v-container>

	</v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { tw2cn, cn2tw } from 'cjk-conv/lib/zh/convert';
import { tw2cn_min, cn2tw_min } from 'cjk-conv/lib/zh/convert/min';
import Throttle from 'lodash-decorators/throttle';
import Debounce from 'lodash-decorators/debounce';

@Component
export default class CjkConv extends Vue
{
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

		if (text)
		{
			this.onChange(text);
		}
		else
		{
			this.value_input = '';
			this.onWatchChange();
		}
	}

	@Debounce(200)
	onChange(text: string)
	{
		let old = this.value_input;
		text = this.value_input = text
			.replace(/^[\r\n]+/g, '')
		;

		if (old != text || text)
		{
			this.runConv(text);
		}
		else if (!text)
		{
			this.runConv('');
		}

	}
}
</script>

<style module lang="scss">
.mytextarea {
	textarea {
		max-height: 60vh !important;
		overflow: auto;
	}
}
</style>
<style lang="scss">
.v-input__slot, .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot
{
	margin-bottom: 0;
}
</style>
