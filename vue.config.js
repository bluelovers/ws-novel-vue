const production = process.env.NODE_ENV === 'production';

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {

	publicPath: './',

	configureWebpack: {

		//plugins: [],

		optimization: {
			splitChunks: {
				chunks: 'all',
			},
			minimize: production,
			minimizer: [new TerserPlugin({
				sourceMap: true,

				terserOptions: {
					compress: {
						dead_code: false,
						global_defs: {},
						ecma: 8,
						inline: true,
						keep_classnames: true,
						keep_fnames: true,
						keep_infinity: true,
						passes: 2,
						pure_getters: false,
						unused: false,
						warnings: true,
					},
					sourceMap: {
						url: "includeSources",
						includeSources: true,
					},
					ecma: 8,
					output: {
						//beautify: true,
//						indent_level: 0,
					},
					keep_classnames: true,
					keep_fnames: true,
				},

			})],
		},

	},

	css: {
		/**
		 * 不要將 moudle 設為 true 否則插件的 CSS 全都會失敗 無法自動導入
		 */
		sourceMap: true,
	},

	devServer: {
		disableHostCheck: true,
		before()
		{
			//return require('./script/fetch-api-json')
		},
		clientLogLevel: 'error',
	},

};
