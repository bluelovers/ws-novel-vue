<template>
	<div class="">
		<ul class="centerx">
			<li>
				<vs-checkbox v-model="checkBox1">Primary - active</vs-checkbox>
			</li>
			<li>
				<vs-checkbox v-model="checkBox2">Primary - inactive</vs-checkbox>
			</li>
			<li>
				<vs-checkbox disabled="true" v-model="checkBox3">Primary - active - disabled</vs-checkbox>
			</li>
			<li>
				<vs-checkbox disabled="true" v-model="checkBox4">Primary - inactive - disabled</vs-checkbox>
			</li>
		</ul>

		<vs-divider position="left">
			My Text
		</vs-divider>
		<vs-divider position="left-center">
			My Text
		</vs-divider>
		<vs-divider position="center">
			My Text
		</vs-divider>
		<vs-divider position="right-center">
			My Text
		</vs-divider>
		<vs-divider position="right">
			My Text
		</vs-divider>

	</div>
</template>

<script lang="ts">
export default {
	name: "Vuesax",
	data(){
		return {
			checkBox1:true,
			checkBox2:false,
			checkBox3:true,
			checkBox4:false,
		}
	}
}
</script>

<style scoped>

</style>
