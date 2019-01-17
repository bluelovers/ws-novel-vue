<template>
	<v-toolbar
		app
		height="40" :clipped-left="$vuetify.breakpoint.lgAndUp"
		fixed
	>
		<v-toolbar-side-icon @click.stop="onDrawer(drawerValue)"></v-toolbar-side-icon>

		<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
			<router-link to="/" class="text-color-inherit top-bar-header-title">Novel</router-link>
		</v-toolbar-title>

		<slot></slot>

		<v-spacer></v-spacer>

		<v-toolbar-items>

			<NavToolbarItems></NavToolbarItems>

		</v-toolbar-items>

	</v-toolbar>
</template>

<script lang="ts">
import { IVueComponent } from '@/lib/vue/index';
import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'
import FooterItems from '@/components/Nav/FooterItems.vue'

@Component({
	components: {
		NavToolbarItems,
	},
})
export default class Topbar extends Vue
{
	drawerValue = false;

	onDrawer(drawerValue: boolean)
	{
		drawerValue = !drawerValue;
		this.drawerValue = drawerValue;

		this.$emit('drawer', drawerValue)
	}

}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Audiowide');

.top-bar-header-title {
	font-family: 'Audiowide', cursive;
	text-shadow: 0px 0px 8px #EE44AA, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
