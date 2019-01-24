
import create, {
	createFromJSON, INovelStatCache, IFilterNovelData, IFilterNovel, NovelStatCache,
	INovelStatCacheHistory,
	createMoment,
} from '@node-novel/cache-loader'
import { cacheSortCallback } from '@node-novel/cache-loader/lib/util'
import path = require('path');
import url from 'url';
import StrUtil from 'str-util';

import NovelInfo = require('node-novel-info');
import { NodeNovelInfo } from 'node-novel-info/class'
import { array_unique, array_unique_overwrite } from 'array-hyper-unique'

let novelStatCache: NovelStatCache;

export { IFilterNovelData, INovelStatCacheHistory, createMoment, NovelInfo, cacheSortCallback }

export function loadNovelStatCache(reload?: boolean)
{
	if (!reload && novelStatCache)
	{
		return novelStatCache
	}

	const novelStatJson = require('../../public/static/novel-stat.json') as INovelStatCache;

	return novelStatCache = createFromJSON(novelStatJson, {
		readonly: true,
	});
}

export function toHalfWidthLocaleLowerCase(s: string)
{
	return StrUtil.toHalfWidth(s).toLocaleLowerCase()
}

export function getNovelTitleFromMeta(mdconf: NovelInfo.IMdconfMeta, novelID?: string)
{
	return array_unique([
		novelID,
		...NovelInfo.getNovelTitleFromMeta(mdconf)
	].map(v => toHalfWidthLocaleLowerCase(v)).filter(v => v))
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
					// @ts-ignore
					const metaInfo = new NodeNovelInfo(novel.mdconf, {
						throw: false,
						lowCheckLevel: true,
					});

					let ks = array_unique([
						novelID,
						...metaInfo.titles(),
					].map(v => toHalfWidthLocaleLowerCase(v)).filter(v => v))
					;

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

					data.contributes.push(...(novel.mdconf.contribute = metaInfo.contributes()));

					if (novel.mdconf.novel)
					{
						data.tags.push(...(novel.mdconf.novel.tags = metaInfo.tags()));
						data.authors.push(...(novel.mdconf.novel.authors = metaInfo.authors()));
						data.publishers.push(...(novel.mdconf.novel.publishers = metaInfo.publishers()));
						data.illusts.push(...(novel.mdconf.novel.illusts = metaInfo.illusts()));
					}

					data.max_chapter = Math.max(data.max_chapter, novel.cache.chapter | 0);
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

			publishers: [] as string[],

			illusts: [] as string[],

			max_chapter: 0,

			data: datamap,
		})
	;

	ret.tags = arr_unique_filter(ret.tags);
	ret.contributes = arr_unique_filter(ret.contributes);
	ret.authors = arr_unique_filter(ret.authors).sort(cacheSortCallback);
	ret.publishers = arr_unique_filter(ret.publishers).sort(cacheSortCallback);
	ret.illusts = arr_unique_filter(ret.illusts).sort(cacheSortCallback);

	return ret
}

export enum EnumEventAction
{
	SEARCH = 'search',
	CLICK = 'click',
}

export enum EnumEventLabel
{
	AUTHOR = 'author',
	CONTRIBUTE = 'contribute',
	KEYWORD = 'keyword',
	TAG = 'tag',
	API = 'api',
	PUBLISHER = 'publisher',

	ILLUST = 'illust',

	CHAPTER_RANGE = 'chapter_range',
}

/**
 * return gitee link
 */
export function novelLink(pathMain: string, novelID: string, ...argv)
{
	return url.resolve('https://gitee.com/bluelovers/novel/tree/master/', [
		pathMain,
		novelID,
	].join('/')) + '/';
}

function arr_unique_filter<T extends any[]>(arr: T)
{
	return array_unique(arr).filter(v => v && v != null && String(v).trim())
}
