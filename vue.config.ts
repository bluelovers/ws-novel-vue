import ChainWebpack = require("webpack-chain");
import TerserPlugin = require('terser-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const development = !production;

module.exports = {

	publicPath: './',

	productionSourceMap: development,

	configureWebpack: {

		//plugins: [],
//		devtool: !production,

		optimization: {

			splitChunks: {
				chunks: 'all',
			},
			minimize: production,
			minimizer: [new TerserPlugin({
				sourceMap: development,

				parallel: true,

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
					sourceMap: production ? undefined : {
						url: "includeSources",
						includeSources: true,
					},
					ecma: 8,
					output: {
						beautify: development,
						indent_level: 0,
						indent_start: 0,
						comments: false,
					},
					keep_classnames: true,
					keep_fnames: true,
				},

				/*
				minify(file, sourceMap)
				{
					const uglifyJsOptions = {

					};

					if (sourceMap) {
						// @ts-ignore
						uglifyJsOptions.sourceMap = {
							content: sourceMap,
						};
					}

					return require('terser').minify(file, uglifyJsOptions);
				},
				*/

			})],
		},

	},

	chainWebpack(config: ChainWebpack)
	{
		config.resolve.extensions.prepend('.tsx');
		config.resolve.extensions.prepend('.ts');

		//console.log(config.resolve.extensions.values());
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
