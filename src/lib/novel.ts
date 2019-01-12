
import create, { createFromJSON, INovelStatCache, IFilterNovelData, IFilterNovel, NovelStatCache } from '@node-novel/cache-loader'
import { cacheSortCallback } from '@node-novel/cache-loader/lib/util'
import path = require('path');

import NovelInfo = require('node-novel-info');
import { array_unique, array_unique_overwrite } from 'array-hyper-unique'

let novelStatCache: NovelStatCache;

export { IFilterNovelData }

export function loadNovelStatCache()
{
	const novelStatJson = require('../../public/static/novel-stat.json') as INovelStatCache;

	return novelStatCache = createFromJSON(novelStatJson, {
		readonly: true,
	});
}

export function dataAll()
{
	novelStatCache = loadNovelStatCache();

	let datamap = novelStatCache.filterNovel();

	let ret = Object.entries(datamap)
		.reduce(function (data, [pathMain, novels])
		{
			data.pathMains.push(pathMain);

			Object.entries(novels)
				.forEach(function ([novelID, novel])
				{
					let ks = array_unique([
						novelID,
						...NovelInfo.getNovelTitleFromMeta(novel.mdconf)
					].filter(v => v));

					ks
						.forEach(title => {
							data.alias[title] = data.alias[title] || [];

							data.alias[title].push(novel);
						})
					;

					let alllist = array_unique(array_unique(ks.map(title => data.alias[title])).reduce((ls, list) => {

						ls.push(...list);

						return ls;
					}, []));

					ks
						.forEach(title => {
							data.alias[title] = alllist;
						})
					;

					data.novels.push(novel);

					if (novel.mdconf.contribute && novel.mdconf.contribute.length)
					{
						data.contributes.push(...novel.mdconf.contribute);
					}

					if (novel.mdconf.novel && novel.mdconf.novel.tags && novel.mdconf.novel.tags.length)
					{
						data.tags.push(...novel.mdconf.novel.tags);
					}

					if (novel.mdconf.novel && novel.mdconf.novel.author)
					{
						data.authors.push(novel.mdconf.novel.author);
					}

					if (novel.mdconf.novel && novel.mdconf.novel.authors && novel.mdconf.novel.authors.length)
					{
						data.authors.push(...novel.mdconf.novel.authors);
					}
				})
			;

			return data
		}, {
			pathMains: [] as string[],
			alias: {} as {
				[title: string]: IFilterNovelData[]
			},
			novels: [] as IFilterNovelData[],

			tags: [] as string[],
			contributes: [] as string[],

			authors: [] as string[],

			data: datamap,
		})
	;

	ret.tags = array_unique(ret.tags);
	ret.contributes = array_unique(ret.contributes);
	ret.authors = array_unique(ret.authors).sort(cacheSortCallback);

	return ret
}
