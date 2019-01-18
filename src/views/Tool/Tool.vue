<template>

	<v-container>
		<router-link to="/tool/cjk-conv">cjk-conv</router-link>

		<router-view class=""></router-view>
	</v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tool extends Vue {}
</script>

<style scoped lang="scss">

</style>
