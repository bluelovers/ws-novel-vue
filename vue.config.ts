/**
 * Created by user on 2019/1/10/010.
 */

const production = process.env.NODE_ENV === 'production';

export = {
	publicPath: './',

	/*
	configureWebpack: {

		//plugins: [],

	},
	*/

	css: {
		modules: true,
		sourceMap: true,

		/*
		loaderOptions: {
			postcss: {

			},
		},
		*/
	},

	devServer: {
		disableHostCheck: true,
	},

	pwa: {},

	pluginOptions: {},
}
