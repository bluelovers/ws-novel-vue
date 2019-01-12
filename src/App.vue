<template>
	<div id="app">
		<v-app dark class="caption">

			<v-toolbar app height="40" :clipped-left="$vuetify.breakpoint.lgAndUp">
				<center style="width: 100%;">
					<router-link to="/">Home</router-link>
					<!--
					|
					<router-link to="/about">About</router-link>
					|
					<router-link to="/vuesax">Vuesax</router-link>
					|
					<router-link to="/novels">Novel</router-link>
					-->
				</center>
			</v-toolbar>
			<v-content>
				<v-container fluid pa-0>
				<router-view class="pa-0 py-2" />
				</v-container>
			</v-content>
			<v-footer app>
				<v-spacer></v-spacer>
				<div class="mr-2">
					<a href="https://gitee.com/bluelovers/novel/raw/master/novel-stat.json" target="_blank" rel="noopener">novel-stat.json</a>
				</div>
				<div class="mr-2">&copy; {{ new Date().getFullYear() }}　</div>
			</v-footer>
		</v-app>
	</div>
</template>

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
