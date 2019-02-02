<template>

	<v-container fluid grid-list-md>

		<vue-headful
			title="cjk-conv"
		/>

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

			<v-checkbox
				label="safe mode"
				v-model="opt_safe"
				class="my-0"
			>
				<v-tooltip lazy top slot="append">
					<v-icon slot="activator">help</v-icon>
					除非有必要否則不要變動此選項
				</v-tooltip>
			</v-checkbox>

			<v-flex xs12 sm6 md3>
				<v-text-field
					label="自定忽略文字不轉換"
					box
					clearable
					:value="opt_skip"
					@change="onInputSkip"
					@input="onInputSkip"
				></v-text-field>
			</v-flex>

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
					@click:prepend-inner="onWatchChange"
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

import { IOptions } from 'cjk-conv/lib/zh/convert';
//import { tw2cn, cn2tw } from 'cjk-conv/lib/zh/convert';
//import { tw2cn_min, cn2tw_min } from 'cjk-conv/lib/zh/convert/min';
import Throttle from 'lodash-decorators/throttle';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
//import UString = require('uni-string');
import { array_unique, array_unique_overwrite } from 'array-hyper-unique'

@Component
export default class CjkConv extends Vue
{
	loading = false;

	rows = 10;

	value_input = '';
	value_output = '';

	opt_tw2cn = false;
	opt_minmode = true;
	opt_safe = true;

	opt_skip = this.$session.get('opt_skip') || '';

	async runConv(text: string)
	{
		this.loading = true;

		if (text)
		{
			let fn;

			if (this.opt_minmode)
			{
				let { tw2cn_min, cn2tw_min } = await import('cjk-conv/lib/zh/convert/min');

				fn = this.opt_tw2cn ? tw2cn_min : cn2tw_min;
			}
			else
			{
				let { tw2cn, cn2tw } = await import('cjk-conv/lib/zh/convert');

				fn = this.opt_tw2cn ? tw2cn : cn2tw;
			}

			const old = text;

			this.value_input = old;

			let fn_options: IOptions = {};

			if (this.opt_skip)
			{
				fn_options.skip = this.opt_skip;
			}

			fn_options.safe = this.opt_safe;

			//console.dir(fn_options);

			text = fn(text, fn_options);
		}

		this.value_output = text;

		this.loading = false;
	}

	@Watch('opt_minmode')
	@Watch('opt_tw2cn')
	@Watch('opt_skip')
	@Watch('opt_safe')
	onWatchChange()
	{
		return this.runConv(this.value_input);
	}

	fnTrim(text: string)
	{
		return (text || '')
			.replace(/^[\r\n]+/g, '')
			.replace(/\n{2,}$/g, '\n')
		;
	}

	async onInputSkip(text?: string)
	{
		text = this.fnTrim(text).replace(/[\s+\w]/ig, '');

		if (text)
		{
			let UString = await import('uni-string');

			text = array_unique(UString.split(text, '')).join('')
		}

		this.opt_skip = text || '';

		this.$session.set('opt_skip', this.opt_skip);
	}

	onInput(text?: string)
	{
		text = this.fnTrim(text);

		if (text)
		{
			return this.onChange(text);
		}
		else
		{
			this.value_input = '';
			return this.onWatchChange();
		}
	}

	@Debounce(500)
	@Bind
	onChange(text: string)
	{
		let old = this.value_input;
		text = this.fnTrim(text);
		this.value_input = text;

		if (old != text || text)
		{
			this.runConv(text);
		}
		else if (!text)
		{
			text = '';
			this.runConv('');
		}

		this.value_input = text;
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

@media (max-width: 450px)
{
	.mytextarea {
		textarea {
			max-height: 30vh !important;
			overflow: auto;
		}
	}
}
</style>
<style lang="scss">
.v-input__slot, .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot
{
	margin-bottom: 0;
}
</style>
