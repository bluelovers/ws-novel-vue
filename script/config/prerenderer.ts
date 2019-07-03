/**
 * Created by user on 2019/6/13.
 */

import { IPostProcessContext } from 'prerenderer-renderer-jsdom/types/renderer';

import JsDomRenderer2 from 'prerenderer-renderer-jsdom'
import PrerenderSPAPlugin, { PuppeteerRenderer } from 'prerender-spa-plugin'
import { array_unique } from 'array-hyper-unique';
import fs from 'fs-extra';
import console, { consoleDebug } from '../util';
import path = require('path');

const ENV_IS_REMOTE = !!process.env.ENV_IS_REMOTE;
const renderAfterTime = 10 * 1000;

consoleDebug.info(`ENV_IS_REMOTE`, ENV_IS_REMOTE);

export function createPrerenderPlugin(ROOT: string)
{
	const staticDir = path.normalize(path.join(ROOT, 'dist'));

	return new PrerenderSPAPlugin({

		staticDir: staticDir,
		indexPath: path.join(staticDir, 'index.html'),
		routes: createRoutes(),
		renderer: createRenderer(),

		async postProcess(renderedRoute: IPostProcessContext)
		{
//					// Ignore any redirects.
//					renderedRoute.route = renderedRoute.originalRoute
//					// Basic whitespace removal. (Don't use this in production.)
//					renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
//					// Remove /index.html from the output path if the dir name ends with a .html file extension.
//					// For example: /dist/dir/special.html/index.html -> /dist/dir/special.html

			//console.dir(renderedRoute);


			let file = path.normalize(path.join(staticDir, renderedRoute.originalRoute));

			await fs.outputFile(file + '/index.html', renderedRoute.html)
				.catch(e => console.error(e.message))
			;

			if (0 && file != staticDir && file != staticDir + '/')
			{
				await fs.outputFile(file, renderedRoute.html)
					.catch(e => console.error(e.message))
				;
			}

			file = path.join(staticDir, decodeURIComponent(renderedRoute.originalRoute));

			await fs.outputFile(file + '/index.html', renderedRoute.html)
				.catch(e => console.error(e.message))
			;

			if (0 && file != staticDir && file != staticDir + '/')
			{
				await fs.outputFile(file, renderedRoute.html)
					.catch(e => console.error(e.message))
				;
			}

//					fs.outputFile(path.join(staticDir, path.dirname(renderedRoute.originalRoute), decodeURIComponent(path.basename(renderedRoute.originalRoute)) + '.html'), renderedRoute.html)
//						.catch(e => console.error(e.message))
//					;

//					if (renderedRoute.route.endsWith('index.html')) {
//						renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
//					}

			return renderedRoute
		},

		/*
		postProcessHtml: function (context) {
			var titles = {
				'/': 'Home',
				'/about': 'Our Story',
				'/history': 'History'
			}
			return context.html.replace(
				/<title>[^<]*<\/title>/i,
				'<title>' + titles[context.route] + '</title>'
			)
		}
		 */
	})
}

export function createRoutes()
{
	return array_unique([
		1, 2, 3, 4, 5,
	].reduce(function (a, n)
		{
			a.push(`?page=${n}`);

			return a
		}, [] as string[])
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
			`/search/chapter_range/001-005`,`/search/chapter_range/006-010`,
			`/search/chapter_range/006-010`,
			`/search/chapter_range/011-020`,
			`/search/chapter_range/021-050`,
			`/search/chapter_range/051-100`,`/search/chapter_range/101-200`,
			`/search/chapter_range/201-300`,`/search/chapter_range/301-400`,
			`/search/chapter_range/501-600`,
			`/search/chapter_range/601-700`,
			`/search/chapter_range/701-800`,`/search/chapter_range/801-900`,

			'/history',
			'/tool/cjk-conv',
		])
		.map(v =>
		{
			return new URL(v, 'http://localhost').pathname
		}))
	;
}

export function createRenderer()
{


	if (ENV_IS_REMOTE)
	{
		consoleDebug.log(`PrerenderPlugin:default`);

		return new PuppeteerRenderer({

			maxConcurrentRoutes: 3,

			renderAfterTime,

			timeout: 60000,

		})
	}

	consoleDebug.log(`PrerenderPlugin:jsdom`);

	return new JsDomRenderer2({
		renderAfterDocumentEvent: 'render-vue-mounted-event',
		//renderAfterElementExists: '#nav',
		renderAfterTime,
		renderAfterTimeMax: Math.max(renderAfterTime, 10000),
		renderAfterDelay: 5000,
	})
}

