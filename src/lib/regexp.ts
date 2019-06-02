import { zhRegExp } from 'regexp-cjk';
import { toHalfWidthLocaleLowerCase } from '@/lib/conv';
import { array_unique } from 'array-hyper-unique'
import createZhRegExpPlugin, { IZhRegExpPluginOptions } from 'regexp-cjk-plugin-extra';
import escapeStringRegexp from 'escape-string-regexp';
import { IOptionsOn } from 'regexp-cjk/lib/core';

let _err: boolean;
let _err2: boolean;
let _cache_plugin: IOptionsOn[];

export function getZhRegExp(): typeof zhRegExp
{
	try
	{
		//return zhRegExp;

		// @ts-ignore
		let c: typeof import('regexp-cjk') = require('regexp-cjk');

		return c.zhRegExp
	}
	catch (e)
	{
		if (!_err)
		{
			console.error(e);
			_err = true;
		}

		// @ts-ignore
		return RegExp
	}
}

function getPlugin()
{
	if (!_cache_plugin)
	{
		_cache_plugin = _cache_plugin || [];

		_cache_plugin.push((require('regexp-cjk-plugin-extra') as typeof import('regexp-cjk-plugin-extra'))
			.createZhRegExpPlugin({
				autoVoice: true,
				autoFullHaif: true,
				autoLocale: true,
				autoDeburr: true,
			}))
	}

	return _cache_plugin
}

export function zhRegExpGreedy(input: unknown, flags?: string)
{
	const zhRegExp = getZhRegExp();

	if (Array.isArray(input))
	{
		input = input.join('|')
	}

	// @ts-ignore
	return new zhRegExp(input as string, flags || '', {
		greedyTable: 2,
		on: getPlugin(),
	});
}

export function zhRegExpGreedyMatchWords(input: string)
{
	try
	{

		//let k = input.replace(/[|\\{}()\[\]^$+*?.]/g, '\\$1');

		let k = escapeStringRegexp(input);

//		let ks = array_unique([
//			k,
//			toHalfWidthLocaleLowerCase(k),
//		]).join('|');

		//let rs = `\^(?:${ks})\$`;

		let rs = `\^(?:${k})\$`;

		//console.log('zhRegExpGreedyMatchWords', k2, rs);

		return zhRegExpGreedy(rs, 'ui')
	}
	catch (e)
	{
		if (!_err2)
		{
			console.error(e);
			_err2 = true;
		}
		return String(input);
	}
}
