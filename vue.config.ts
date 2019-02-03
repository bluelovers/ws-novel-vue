import ChainWebpack = require("webpack-chain");
import TerserPlugin = require('terser-webpack-plugin');
import webpack = require('webpack');
import path = require('path');
import console from './script/util';

const production = process.env.NODE_ENV === 'production';
const development = !production;

console.debug('NODE_ENV', process.env.NODE_ENV);

let allowSourceMap: boolean = development;

module.exports = {

	publicPath: '/',

	productionSourceMap: allowSourceMap,

	runtimeCompiler: true,

	configureWebpack: {

		/*
		output: {
			filename: 'js/[name].[hash].js',
			chunkFilename: 'js/[id].bundle.[contenthash:8].js',
		},
		*/

		/*
		entry: {
			tool: [
				'./src/main.ts',
			],
		},
		*/

//		devtool: 'source-map',

		plugins: [
			/**
			 * https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
			 */
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja/),
			new webpack.IgnorePlugin(/zh[/\\]convert[/\\].*\.txt/, /cjk-conv/),
		],
//		devtool: !production,

		optimization: {

			splitChunks: {
				chunks: 'all',
//				minSize: 1048,
//				maxSize: 0,
				name: true,

				cacheGroups: {
//					tool: {
//						test: /^tool$/,
//					},
//					cjk: {
//						test: /cjk|japanese|chinese/,
//						priority: 20,
////						reuseExistingChunk: true,
//					},
					'novel-stat-json': {
						test: /build\.json$|novel-stat\.json$/,
						priority: 20,
//						reuseExistingChunk: true,
					},
//					'novel': {
//						test: /-cjk|cjk-|japanese|chinese|regexp+-|uni-string|regexpp|mdconf|novel-|node-novel|str-util/,
//						priority: 10,
////						reuseExistingChunk: true,
//					},
//					'vendor': {
//						test: /node_modules/,
//						priority: 0,
////						reuseExistingChunk: true,
//					},
//					'build-json': {
//						test: /setting[\/\\]build.json/,
//						priority: 10,
////						reuseExistingChunk: true,
//					},
//					default: {
//						minChunks: 2,
//						priority: -20,
////						reuseExistingChunk: true
//					},
				},
			},

			runtimeChunk: {
				name: entrypoint => `runtime~${entrypoint.name}`
			},

			minimize: production,
			minimizer: [getTerserPlugin()],
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

		console.dir(config.toConfig());

		/*
		config.optimization.splitChunks({
			chunks: 'all',
		});
		*/

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
				conf.reportFiles.push('!**/*.d.ts');

				conf.compilerOptions = conf.compilerOptions || {};
				conf.compilerOptions.skipLibCheck = true;
				conf.silent = true;

				console.dir(conf);

				return argv
			})
		;
	},

	css: {
		/**
		 * 不要將 moudle 設為 true 否則插件的 CSS 全都會失敗 無法自動導入
		 */
		sourceMap: allowSourceMap,
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

function getTerserPlugin()
{
	if (!production)
	{
		return new TerserPlugin({
			sourceMap: allowSourceMap,

			terserOptions: {

				output: {
					indent_level: 0,
					indent_start: 0,
					comments: false,
				},

				sourceMap: !allowSourceMap ? undefined : {
					url: "includeSources",
					includeSources: true,
				},
			},
		});
	}

	return new TerserPlugin({
		sourceMap: allowSourceMap,

		//parallel: true,

		//exclude: /regexp-cjk|regex/,

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
			sourceMap: !allowSourceMap ? undefined : {
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

	})
}
