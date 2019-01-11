import Vue from 'vue'
import Vuetify from 'vuetify'
//import 'vuetify/dist/vuetify.min.css'
import '../assets/stylus/main.styl'
import zhHant from 'vuetify/src/locale/zh-Hant'

Vue.use(Vuetify, {

	theme: {
		primary: '#ee44aa',
		secondary: '#424242',
		accent: '#82B1FF',
		error: '#FF5252',
		info: '#2196F3',
		success: '#4CAF50',
		warning: '#FFC107',
	},

	customProperties: true,
	iconfont: 'md',
	lang: {
		locales: { zhHant },
		current: 'zh-Hant',
	},

	options: {
		minifyTheme: function (css)
		{
			return process.env.NODE_ENV === 'production'
				? css
					.replace(/[\r\n\r\n]+/g, '')
					.replace(/\s+/g, ' ')
				: css
		},
	},

});
