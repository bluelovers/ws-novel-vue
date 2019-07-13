"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const prerenderer_renderer_jsdom_1 = tslib_1.__importDefault(require("prerenderer-renderer-jsdom"));
const prerender_spa_plugin_1 = tslib_1.__importStar(require("prerender-spa-plugin"));
const array_hyper_unique_1 = require("array-hyper-unique");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const util_1 = tslib_1.__importStar(require("../util"));
const path = require("path");
const ENV_IS_REMOTE = !!process.env.ENV_IS_REMOTE;
const renderAfterTime = 3 * 1000;
util_1.consoleDebug.info(`ENV_IS_REMOTE`, ENV_IS_REMOTE);
function createPrerenderPlugin(ROOT) {
    const staticDir = path.normalize(path.join(ROOT, 'dist'));
    return new prerender_spa_plugin_1.default({
        staticDir: staticDir,
        indexPath: path.join(staticDir, 'index.html'),
        routes: createRoutes(),
        renderer: createRenderer(),
        async postProcess(renderedRoute) {
            //					// Ignore any redirects.
            //					renderedRoute.route = renderedRoute.originalRoute
            //					// Basic whitespace removal. (Don't use this in production.)
            //					renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
            //					// Remove /index.html from the output path if the dir name ends with a .html file extension.
            //					// For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
            //console.dir(renderedRoute);
            let file = path.normalize(path.join(staticDir, renderedRoute.originalRoute));
            await fs_extra_1.default.outputFile(file + '/index.html', renderedRoute.html)
                .catch(e => util_1.default.error(e.message));
            if (0 && file != staticDir && file != staticDir + '/') {
                await fs_extra_1.default.outputFile(file, renderedRoute.html)
                    .catch(e => util_1.default.error(e.message));
            }
            file = path.join(staticDir, decodeURIComponent(renderedRoute.originalRoute));
            await fs_extra_1.default.outputFile(file + '/index.html', renderedRoute.html)
                .catch(e => util_1.default.error(e.message));
            if (0 && file != staticDir && file != staticDir + '/') {
                await fs_extra_1.default.outputFile(file, renderedRoute.html)
                    .catch(e => util_1.default.error(e.message));
            }
            //					fs.outputFile(path.join(staticDir, path.dirname(renderedRoute.originalRoute), decodeURIComponent(path.basename(renderedRoute.originalRoute)) + '.html'), renderedRoute.html)
            //						.catch(e => console.error(e.message))
            //					;
            //					if (renderedRoute.route.endsWith('index.html')) {
            //						renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
            //					}
            return renderedRoute;
        },
    });
}
exports.createPrerenderPlugin = createPrerenderPlugin;
function createRoutes() {
    return array_hyper_unique_1.array_unique([
        1, 2, 3, 4, 5,
    ].reduce(function (a, n) {
        //a.push(`?page=${n}`);
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
        `/search/chapter_range/001-005`,
        `/search/chapter_range/006-010`,
        `/search/chapter_range/011-020`,
        `/search/chapter_range/021-050`,
        `/search/chapter_range/051-100`,
        `/search/chapter_range/101-200`,
        `/search/chapter_range/201-300`,
        `/search/chapter_range/301-400`,
        `/search/chapter_range/501-600`,
        `/search/chapter_range/601-700`,
        `/search/chapter_range/701-800`,
        `/search/chapter_range/801-900`,
        '/history',
        '/tool/cjk-conv',
    ])
        .map(v => {
        return new URL(v, 'http://localhost').pathname;
    }));
}
exports.createRoutes = createRoutes;
function createRenderer() {
    if (ENV_IS_REMOTE) {
        util_1.consoleDebug.log(`PrerenderPlugin:default`);
        return new prerender_spa_plugin_1.PuppeteerRenderer({
            maxConcurrentRoutes: 1,
            renderAfterTime,
            timeout: 60000,
        });
    }
    util_1.consoleDebug.log(`PrerenderPlugin:jsdom`);
    return new prerenderer_renderer_jsdom_1.default({
        renderAfterDocumentEvent: 'render-vue-mounted-event',
        //renderAfterElementExists: '#nav',
        renderAfterTime,
        renderAfterTimeMax: Math.max(renderAfterTime, 10000),
        renderAfterDelay: 5000,
    });
}
exports.createRenderer = createRenderer;
