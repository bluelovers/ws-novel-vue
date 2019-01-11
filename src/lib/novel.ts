
import create, { createFromJSON, INovelStatCache, IFilterNovelData, IFilterNovel, NovelStatCache } from '@node-novel/cache-loader'
import path = require('path');

import NovelInfo = require('node-novel-info');
import { array_unique } from 'array-hyper-unique'

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

	return Object.entries(datamap)
		.reduce(function (data, [pathMain, novels])
		{
			data.pathMains.push(pathMain);

			Object.entries(novels)
				.forEach(function ([novelID, novel])
				{
					array_unique([
						novelID,
						...NovelInfo.getNovelTitleFromMeta(novel.mdconf)
					].filter(v => v))
						.forEach(title => {
							data.alias[title] = data.alias[title] || [];

							data.alias[title].push(novel);
						})
					;

					data.novels.push(novel);
				})
			;

			return data
		}, {
			pathMains: [] as string[],
			alias: {} as {
				[title: string]: IFilterNovelData[]
			},
			novels: [] as IFilterNovelData[],

			data: datamap,
		})
	;
}
