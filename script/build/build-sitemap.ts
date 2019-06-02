/**
 * Created by user on 2019/5/1.
 */

import { createMoment, dataAll, EnumEventAction, EnumEventLabel, listChapterRange } from '../../src/lib/novel';
import ProjectConfig, { siteUrl } from '../../project.config';
import url from 'url';
import sm = require('sitemap');
import fs = require('fs-extra');
import path = require('path');
import console from '../util';

async function runBuild()
{
	let sitemap = sm.createSitemap({
		hostname: siteUrl,
		cacheTime: 24 * 3600 * 1000,  // 600 sec cache period
		urls: [],
	});

	let NovelData = dataAll();

	sitemap.add({
		url: url.resolve(siteUrl, `history`),
		changefreq: 'daily',
		priority: 0.3,
	});

	sitemap.add({
		url: url.resolve(siteUrl, `tool/cjk-conv`),
		changefreq: 'monthly',
		priority: 0.3,
	});

	sitemap.add({
		url: url.resolve(siteUrl, `static/opds.xml`),
		changefreq: 'daily',
		priority: 0.3,
	});

	listChapterRange(NovelData.max_chapter)
		.forEach(row =>
		{

			addSitemap(sitemap, {
				url: createVueLink(row.label, EnumEventLabel.CHAPTER_RANGE),
				changefreq: 'daily',
				priority: 0.5,
			}, 5);

		})
	;

	NovelData.tags
		.forEach(title =>
	{

		addSitemap(sitemap, {
			url: createVueLink(title, EnumEventLabel.TAG),
			changefreq: 'daily',
			priority: 0.8,
		}, 5);

	})
	;

	NovelData.authors
		.forEach(title =>
		{

			addSitemap(sitemap, {
				url: createVueLink(title, EnumEventLabel.AUTHOR),
				changefreq: 'daily',
				priority: 0.8,
			}, 2);

		})
	;

	NovelData.publishers.forEach(title =>
	{
		addSitemap(sitemap, {
			url: createVueLink(title, EnumEventLabel.PUBLISHER),
			changefreq: 'monthly',
			priority: 0.9,
		}, 10);
	});

	Object.keys(NovelData.alias).forEach(title => {

		let data = NovelData.alias[title].sort((a, b) => {
			return a.update_date - b.update_date
		})[0];

		let _append = {} as any;

		try
		{
			if (data.mdconf.novel.cover)
			{
				_append.img = [
					{
						url: data.mdconf.novel.cover,
						caption: data.title,
						title: data.title,
					}
				];
			}
		}
		catch (e)
		{

		}

		sitemap.add({
			url: createVueLink(title),
			changefreq: 'daily',
			priority: 1,
			lastmod: createMoment(data.update_date).toDate(),
			..._append,
		})
	});

	NovelData.illusts.forEach(title =>
	{

		addSitemap(sitemap, {
			url: createVueLink(title, EnumEventLabel.ILLUST),
			changefreq: 'monthly',
			priority: 0.6,
		}, 2);

	});

	NovelData.contributes.forEach(title =>
	{
		addSitemap(sitemap, {
			url: createVueLink(title, EnumEventLabel.CONTRIBUTE),
			changefreq: 'monthly',
			priority: 0.1,
		}, 2);
	});

	let xml = sitemap.toXML();

	//console.log(xml);

	console.success(`[build] sitemap.xml`);

	return fs.writeFileSync(path.join(ProjectConfig.ProjectRoot, 'public/sitemap.xml'), xml)
}

function createVueLink(text: string, type: EnumEventLabel = EnumEventLabel.KEYWORD)
{
	return url.resolve(siteUrl, [
		EnumEventAction.SEARCH,
		`${type}?searchValue=${text}`,
	].join('/'))
}

function addSitemap(sitemap, data: {
	url: string,
	changefreq: string,
	priority: number,
}, pages?: number)
{
	let { url, changefreq, priority } = data;

	sitemap.add({
		url, changefreq, priority
	});

	if (pages && pages > 1)
	{
		let u = new URL(url, siteUrl);

		let i = 1;
		while (i++ <= pages)
		{
			u.searchParams.set('page', i as any);

			sitemap.add({
				url: u.href,
				changefreq,
				priority
			})
		}
	}
}

export = runBuild()

