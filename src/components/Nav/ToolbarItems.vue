<template>
	<v-toolbar-items>

		<v-btn icon>
			<router-link to="/" class="text-color-inherit">
				<v-icon>developer_board</v-icon>
			</router-link>
		</v-btn>

		<v-spacer />

		<v-btn icon>
			<router-link to="/history" class="text-color-inherit">
				<v-icon>history</v-icon>
			</router-link>
		</v-btn>

		<v-btn icon onclick="window.location.reload(true)">
			<v-icon>refresh</v-icon>
		</v-btn>

	</v-toolbar-items>
</template>

<script lang="ts">
export default {
	name: "NavToolbarItems",
}
</script>

<style scoped lang="scss">

</style>
