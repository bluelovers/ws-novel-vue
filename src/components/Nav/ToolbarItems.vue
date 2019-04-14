<template>
	<v-toolbar-items>

		<v-btn
			onclick="window.open('https://discord.gg/MnXkpmX', 'discordapp467794087769014273')"
			@click="_ga('click', 'api', 'discord')"
			class="hidden-sm-and-down"
		>
			<img src="https://discordapp.com/api/guilds/467794087769014273/embed.png"/>
		</v-btn>

		<v-spacer />

		<v-btn icon onclick="window.location.reload(true)" @click="_ga('click', 'api', 'reload')">
			<v-icon>refresh</v-icon>
		</v-btn>

	</v-toolbar-items>
</template>

<script lang="ts">
import { IVueComponent } from '@/lib/vue/index';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import FooterItems from '@/components/Nav/FooterItems.vue'

import {
	loadNovelStatCache,
	createMoment,
	EnumEventAction,
	EnumEventLabel,
} from '@/lib/novel';

@Component
export default class extends Vue {

	_ga(this: IVueComponent, eventAction: EnumEventAction, eventLabel: EnumEventLabel, eventValue: string)
	{
		this.$ga && this.$ga.event(eventAction, eventLabel, eventValue)
	}

}
</script>

<style scoped lang="scss">

</style>
