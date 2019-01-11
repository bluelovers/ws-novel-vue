import Vue from 'vue'

Vue.mixin({
	data: function() {
		return {
			get publicPath() {
				return process.env.BASE_URL;
			}
		}
	}
});
