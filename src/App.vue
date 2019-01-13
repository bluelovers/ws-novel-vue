<template>
	<div id="app">
		<v-app dark class="caption">

			<v-toolbar
				app
				height="40" :clipped-left="$vuetify.breakpoint.lgAndUp"
				fixed
			>
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

				<v-toolbar-title style="width: 300px" class="ml-0 pl-3">

					<router-link to="/" class="text-color-inherit">Novel</router-link>
				</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-toolbar-items>

					<NavToolbarItems></NavToolbarItems>

				</v-toolbar-items>

			</v-toolbar>

			<v-content>
				<v-container fluid pa-0>
				<router-view class="pa-0 py-2" />
				</v-container>
			</v-content>
			<v-footer app>
				<v-spacer></v-spacer>
				<div class="mr-2">
					<a :href="`${publicPath}static/novel-stat.json`" target="_blank" rel="noopener">novel-stat.json</a>
				</div>
				<div class="mr-2">&copy; {{ new Date().getFullYear() }}　</div>
			</v-footer>
		</v-app>
		<vue-headful
			title="Novels"
		/>
	</div>
</template>

<script lang="ts">
import { IVueComponent } from '@/lib/vue/index';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import NavToolbarItems from '@/components/Nav/ToolbarItems.vue'

@Component({
	components: {
		NavToolbarItems,
	},
})
export default class extends Vue {}
</script>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	/*color: #2C3E50;*/
}

#nav {
	/*padding: 30px;*/

	a {
		font-weight: bold;
		/*color: #2C3E50;*/

		&.router-link-exact-active {
			/*color: #42B983;*/
		}
	}
}
</style>
