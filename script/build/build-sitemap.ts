/**
 * Created by user on 2019/5/1.
 */

import { dataAll, EnumEventAction, EnumEventLabel, listChapterRange } from '../../src/lib/novel';
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

	NovelData.publishers.forEach(title =>
	{
		sitemap.add(createVueLink(title, EnumEventLabel.AUTHOR))
	});

	listChapterRange(NovelData.max_chapter)
		.forEach(row =>
		{
			sitemap.add(createVueLink(row.label, EnumEventLabel.CHAPTER_RANGE))
		})
	;

	NovelData.tags
		.forEach(title =>
	{
		sitemap.add(createVueLink(title, EnumEventLabel.TAG))
	})
	;

	NovelData.authors
		.forEach(title =>
		{
			sitemap.add(createVueLink(title, EnumEventLabel.AUTHOR))
		})
	;

	/*
	Object.keys(NovelData.alias).forEach(title => {
		sitemap.add(createVueLink(title))
	});
	*/

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

export = runBuild()

