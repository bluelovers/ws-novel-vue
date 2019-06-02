"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("./script/util"));
const prerender_spa_plugin_1 = tslib_1.__importDefault(require("prerender-spa-plugin"));
const renderer_jsdom_1 = tslib_1.__importDefault(require("@prerenderer/renderer-jsdom"));
const array_hyper_unique_1 = require("array-hyper-unique");
const production = process.env.NODE_ENV === 'production';
const development = !production;
util_1.default.debug('NODE_ENV', process.env.NODE_ENV);
util_1.default.debug('BASE_URL', process.env.BASE_URL);
let allowSourceMap = development;
const ROOT = path.join(__dirname);
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
            new prerender_spa_plugin_1.default({
                staticDir: path.join(ROOT, 'dist'),
                indexPath: path.join(ROOT, 'dist', 'index.html'),
                routes: array_hyper_unique_1.array_unique([
                    1, 2, 3, 4, 5,
                ].reduce(function (a, n) {
                    a.push(`?page=${n}`);
                    return a;
                }, [])
                    .concat([
                    `/search/tag?searchValue=百合`,
                    `/search/author/kiki`,
                    `/search/author/黒水蛇`,
                    `/search/tag?searchValue=novel18`,
                    `/search/contribute?searchValue=我只是一個紳士`,
                    `/search/publisher`,
                    `/search/illust`,
                    `/search/author`,
                    `/search/tag`,
                    `/search/chapter_range`,
                    '/history',
                    '/tool/cjk-conv',
                ])
                    .map(v => {
                    return new URL(v, 'http://localhost').pathname;
                })),
                renderer: new renderer_jsdom_1.default({
                    //renderAfterDocumentEvent: 'onload',
                    //renderAfterElementExists: '#nav',
                    renderAfterTime: 10000,
                    headless: false,
                }),
            }),
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
                    },
                },
            },
            runtimeChunk: {
                name: entrypoint => `runtime~${entrypoint.name}`,
            },
            minimize: production,
            minimizer: [getTerserPlugin()],
        },
    },
    chainWebpack(config) {
        //config.resolve.extensions.prepend('.tsx');
        //config.resolve.extensions.prepend('.ts');
        //console.log(config.resolve.extensions.values());
        //		const webpack = require('webpack');
        //		// @ts-ignore
        //		config.plugins.set(new webpack.IgnorePlugin(/\.d\.ts$/))
        //		config.plugins.set(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        util_1.default.dir(config.toConfig());
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
            .tap(function (...argv) {
            let conf = argv[0][0];
            util_1.default.info('fork-ts-checker');
            util_1.default.dir(argv);
            util_1.default.gray('-'.repeat(10));
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
            util_1.default.dir(conf);
            return argv;
        });
    },
    css: {
        /**
         * 不要將 moudle 設為 true 否則插件的 CSS 全都會失敗 無法自動導入
         */
        sourceMap: allowSourceMap,
    },
    devServer: {
        disableHostCheck: true,
        before() {
            //return require('./script/fetch-api-json')
        },
        clientLogLevel: 'error',
    },
};
function getTerserPlugin() {
    if (!production) {
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
    });
}
