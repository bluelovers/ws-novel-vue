<template>
	<ul id="novel-list">
		<li v-for="item in novels">
			{{ item.novelID }}
		</li>
	</ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { dataAll } from '../../lib/novel';

const NovelData = dataAll();

@Component
export default class List extends Vue
{

	data()
	{
		return {
			novels: NovelData.novels,
		}
	}

}
</script>

<style scoped lang="scss">

</style>
