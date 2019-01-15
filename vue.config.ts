import ChainWebpack = require("webpack-chain");
import TerserPlugin = require('terser-webpack-plugin');
import webpack = require('webpack');
import path = require('path');
import console from './script/util';

const production = process.env.NODE_ENV === 'production';
const development = !production;

console.debug('NODE_ENV', process.env.NODE_ENV);

module.exports = {

	publicPath: '/',

	productionSourceMap: development,

	runtimeCompiler: true,

	configureWebpack: {

		plugins: [
			/**
			 * https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
			 */
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja/),
		],
//		devtool: !production,

		optimization: {

			splitChunks: {
				chunks: 'all',
			},
			minimize: production,
			minimizer: [new TerserPlugin({
				sourceMap: development,

				//parallel: true,

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
		//config.resolve.extensions.prepend('.tsx');
		//config.resolve.extensions.prepend('.ts');

		//console.log(config.resolve.extensions.values());

//		const webpack = require('webpack');

//		// @ts-ignore
//		config.plugins.set(new webpack.IgnorePlugin(/\.d\.ts$/))


//		config.plugins.set(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

		config
			.plugin('fork-ts-checker')
			/*
			.use(require('fork-ts-checker-webpack-plugin'), [{
				vue: true,
				tslint: false,
				formatter: 'codeframe',
				checkSyntacticErrors: false,
			}])
			*/
			.tap(function (...argv)
			{
				let conf = argv[0][0];

				console.info('fork-ts-checker');

				console.dir(argv);

				console.gray('-'.repeat(10));

				conf.tslint = false;
				conf.transpileOnly = true;
				conf.checkSyntacticErrors = false;

				conf.tsconfig = path.resolve(__dirname, 'tsconfig.json');

				conf.reportFiles = conf.reportFiles || [];
				conf.reportFiles.push('!*.d.ts');

				console.dir(conf);

				return argv
			})
		;
	},

	css: {
		/**
		 * 不要將 moudle 設為 true 否則插件的 CSS 全都會失敗 無法自動導入
		 */
		sourceMap: development,
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
