"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TerserPlugin = require("terser-webpack-plugin");
const production = process.env.NODE_ENV === 'production';
const development = !production;
module.exports = {
    publicPath: './',
    productionSourceMap: development,
    configureWebpack: {
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
                })],
        },
    },
    chainWebpack(config) {
        config.resolve.extensions.prepend('.tsx');
        config.resolve.extensions.prepend('.ts');
    },
    css: {
        sourceMap: true,
    },
    devServer: {
        disableHostCheck: true,
        before() {
        },
        clientLogLevel: 'error',
    },
};
//# sourceMappingURL=vue.config.js.map