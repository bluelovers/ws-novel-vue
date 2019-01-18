"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("./script/util"));
const production = process.env.NODE_ENV === 'production';
const development = !production;
util_1.default.debug('NODE_ENV', process.env.NODE_ENV);
module.exports = {
    publicPath: '/',
    productionSourceMap: development,
    runtimeCompiler: true,
    configureWebpack: {
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja/),
        ],
        optimization: {
            minimize: production,
            minimizer: [new TerserPlugin({
                    sourceMap: development,
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
                })],
        },
    },
    chainWebpack(config) {
        config
            .plugin('fork-ts-checker')
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
        sourceMap: development,
    },
    devServer: {
        disableHostCheck: true,
        before() {
        },
        clientLogLevel: 'error',
    },
};
//# sourceMappingURL=vue.config.js.map