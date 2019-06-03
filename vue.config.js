"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("./script/util"));
const prerender_spa_plugin_1 = tslib_1.__importDefault(require("prerender-spa-plugin"));
const prerenderer_renderer_jsdom_1 = tslib_1.__importDefault(require("prerenderer-renderer-jsdom"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
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
            production && new prerender_spa_plugin_1.default({
                staticDir: path.join(ROOT, 'dist'),
                indexPath: path.join(ROOT, 'dist', 'index.html'),
                routes: array_hyper_unique_1.array_unique([
                    1, 2, 3, 4, 5,
                ].reduce(function (a, n) {
                    a.push(`?page=${n}`);
                    return a;
                }, [])
                    .concat([
                    `/search/tag/百合`,
                    `/search/author/kiki`,
                    `/search/tag/novel18`,
                    `/search/contribute`,
                    `/search/publisher`,
                    `/search/illust`,
                    `/search/keyword`,
                    `/search/keyword/魔王`,
                    `/search/keyword/姬騎士`,
                    `/search/keyword/蜘蛛`,
                    `/search/keyword/四度目`,
                    `/search/keyword/幼女`,
                    `/search/tag/魔王`,
                    `/search/tag/病嬌`,
                    `/search/tag/女主人公`,
                    `/search/tag/TS`,
                    `/search/author`,
                    `/search/tag`,
                    `/search/chapter_range`,
                    `/search/chapter_range/000-000`,
                    `/search/chapter_range/001-005`, `/search/chapter_range/006-010`,
                    `/search/chapter_range/006-010`,
                    `/search/chapter_range/011-020`,
                    `/search/chapter_range/021-050`,
                    `/search/chapter_range/051-100`, `/search/chapter_range/101-200`,
                    `/search/chapter_range/201-300`, `/search/chapter_range/301-400`,
                    `/search/chapter_range/501-600`,
                    `/search/chapter_range/601-700`,
                    `/search/chapter_range/701-800`, `/search/chapter_range/801-900`,
                    '/history',
                    '/tool/cjk-conv',
                ])
                    .map(v => {
                    return new URL(v, 'http://localhost').pathname;
                })),
                renderer: new prerenderer_renderer_jsdom_1.default({
                    renderAfterDocumentEvent: 'render-vue-mounted-event',
                    //renderAfterElementExists: '#nav',
                    renderAfterTime: 10000,
                    renderAfterTimeMax: 10000,
                    renderAfterDelay: 3000,
                }),
                postProcess(renderedRoute) {
                    //					// Ignore any redirects.
                    //					renderedRoute.route = renderedRoute.originalRoute
                    //					// Basic whitespace removal. (Don't use this in production.)
                    //					renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
                    //					// Remove /index.html from the output path if the dir name ends with a .html file extension.
                    //					// For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
                    const staticDir = path.join(ROOT, 'dist');
                    //console.dir(renderedRoute);
                    fs_extra_1.default.outputFile(path.join(staticDir, renderedRoute.originalRoute + '/index.html'), renderedRoute.html)
                        .catch(e => util_1.default.error(e.message));
                    //					fs.outputFile(path.join(staticDir, path.dirname(renderedRoute.originalRoute), decodeURIComponent(path.basename(renderedRoute.originalRoute)) + '.html'), renderedRoute.html)
                    //						.catch(e => console.error(e.message))
                    //					;
                    //					if (renderedRoute.route.endsWith('index.html')) {
                    //						renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
                    //					}
                    return renderedRoute;
                },
            }),
        ].filter(v => v),
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
