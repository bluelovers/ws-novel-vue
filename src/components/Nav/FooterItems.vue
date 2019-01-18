<template>
	<v-toolbar-items>

		<router-link to="/" class="text-color-inherit" style="display: inline-block;">
			<v-btn icon class="my-0">
				<v-icon>developer_board</v-icon>
			</v-btn>
		</router-link>

		<v-spacer />

		<router-link to="/history" class="text-color-inherit" style="display: inline-block;">
			<v-btn icon class="my-0">
				<v-icon>history</v-icon>
			</v-btn>
		</router-link>

		<router-link to="/tool/cjk-conv" class="text-color-inherit" style="display: inline-block;">
			<v-btn icon class="my-0">
				<v-icon>build</v-icon>
			</v-btn>
		</router-link>

	</v-toolbar-items>
</template>

<script lang="ts">
export default {
	name: "NavToolbarItems",
}
</script>

<style scoped lang="scss">

</style>
