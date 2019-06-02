import ProjectSetting from '../setting';
import {
	createFromJSON,
	createMoment,
	IFilterNovelData,
	INovelStatCache,
	INovelStatCacheHistory,
	NovelStatCache,
} from '@node-novel/cache-loader'
import { cacheSortCallback } from '@node-novel/cache-loader/lib/util'
import url from 'url';
import { NodeNovelInfo } from 'node-novel-info/class'
import { array_unique } from 'array-hyper-unique'
import { toHalfWidthLocaleLowerCase } from './conv';
import NovelInfo = require('node-novel-info');
import { slugify } from 'cjk-conv/lib/zh/table/list';

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

export function getNovelTitleFromMeta(mdconf: NovelInfo.IMdconfMeta, novelID?: string)
{
	return array_unique([
		novelID,
		...NovelInfo.getNovelTitleFromMeta(mdconf),
	].map(v => toHalfWidthLocaleLowerCase(v)).filter(v => v))
}

export type IFilterNovelDataPlus = IFilterNovelData & {
	_index: number,
	update_date: number,
	update_date2: number,
	epub_date: number,
	segment_date: number,
	title: string,
};

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

					novel.cache = novel.cache || {};

					/*
					if (novelID == 'ロリータ・ガンバレット　～魔弾幼女の異世界戦記～')
					{
						console.log(novel.cache);

						novel.cache.update_date && console.log(createMoment(novel.cache.update_date).format());
						novel.cache.init_date && console.log(createMoment(novel.cache.init_date).format());
						novel.cache.segment_date && console.log(createMoment(novel.cache.segment_date).format());
						novel.cache.epub_date && console.log(createMoment(novel.cache.epub_date).format());
					}
					*/

					// @ts-ignore
					novel.update_date2 = Math.max(
						novel.cache.update_date || 0,
						novel.cache.init_date || 0,
						novel.cache.segment_date || 0,
						novel.cache.epub_date || 0,
						0,
					);

					// @ts-ignore
					novel.update_date = novel.update_date2 && createMoment(novel.update_date2).startOf('day').valueOf() || 0;

					// @ts-ignore
					novel.epub_date = novel.cache.epub_date && createMoment(novel.cache.epub_date).startOf('day').valueOf() || 0;
					// @ts-ignore
					novel.segment_date = novel.cache.segment_date && createMoment(novel.cache.segment_date)
						.startOf('day')
						.valueOf() || 0;

					// @ts-ignore
					const metaInfo = new NodeNovelInfo(novel.mdconf, {
						throw: false,
						lowCheckLevel: true,
					});

					// @ts-ignore
					novel.title = metaInfo.title(novelID);

					let ks = array_unique([
							novelID,
							...metaInfo.titles(),
							...metaInfo.series_titles(),
						].reduce((a, v) =>
						{
							a.push(toHalfWidthLocaleLowerCase(v));
							a.push(toHalfWidthLocaleLowerCase(slugify(v, true)));

							return a;

						}, [] as string[]).filter(v => v))
					;

					ks
						.forEach(title =>
						{
							data.alias[title] = data.alias[title] || [];

							data.alias[title].push(novel as IFilterNovelDataPlus);
						})
					;

					let alllist = array_unique(array_unique(ks.map(title => data.alias[title])).reduce((ls, list) =>
					{

						ls.push(...list);

						return ls;
					}, []));

					ks
						.forEach(title =>
						{
							data.alias[title] = alllist;
						})
					;

					data.novels.push(novel as IFilterNovelDataPlus);

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
				[title: string]: IFilterNovelDataPlus[]
			},
			novels: [] as IFilterNovelDataPlus[],

			tags: [] as string[],
			contributes: [] as string[],

			authors: [] as string[],

			publishers: [] as string[],

			illusts: [] as string[],

			max_chapter: 0,

			data: datamap,
		})
	;

	ret.novels.forEach(function (novel, index)
	{
		novel._index = index;
	});

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
	return url.resolve(ProjectSetting.NOVEL_LINK, [
		pathMain,
		novelID,
	].join('/')) + '/';
}

export function novelLinkPathMain(pathMain: string, ...argv)
{
	return url.resolve(ProjectSetting.NOVEL_LINK, [
		pathMain,
	].join('/')) + '/';
}


function arr_unique_filter<T extends any[]>(arr: T)
{
	return array_unique(arr).filter(v => v && v != null && String(v).trim())
}

export function listChapterRange(max_chapter: number)
{
	let len = Math.ceil(max_chapter / 100);

	let size = (len * 100).toString().length;

	let chapter_range: number[] = [];

	while (len--)
	{
		chapter_range[len] = (len + 1) * 100;
	}

	chapter_range.unshift(50);
	chapter_range.unshift(20);
	chapter_range.unshift(10);
	chapter_range.unshift(5);
	chapter_range.unshift(0);

	let ls: {
		value: number,
		min: number,
		label: string
	}[] = [];

	[0].concat(chapter_range as number[]).reduce(function (p, value)
	{

		ls.push({
			value,
			min: p,
			label: `${String(p).padStart(size, '0')}-${String(value).padStart(size, '0')}`,
		});

		return value + 1;
	});

	return ls
}
