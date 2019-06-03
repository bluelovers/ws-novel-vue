
import matchProperty = require('unicode-match-property-ecmascript');
import { zhRegExp } from 'regexp-cjk';
import { toHalfWidthLocaleLowerCase } from '@/lib/conv';
import { array_unique } from 'array-hyper-unique'
import createZhRegExpPlugin, { IZhRegExpPluginOptions } from 'regexp-cjk-plugin-extra';
import escapeStringRegexp from 'escape-string-regexp';
import { IOptionsOn } from 'regexp-cjk/lib/core';
import { matchOperatorsAndPunctuationRegex } from '@/lib/regex/const';

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
	return new zhRegExp(input as string, input.flags || 'u', input.f, {
		greedyTable: 2,
		on: getPlugin(),
	});
}

export function zhRegExpGreedyMatchWords(input: string)
{
	let re: RegExp;
	let rs: string;

	let bool = [
		() => {
			let k = escapeStringRegexp(input);
			rs = `\^(?:${k})\$`;

			return zhRegExpGreedy(rs, 'ui')
		},

		() => {
			let k = input;
			rs = `\^(?:${k})\$`;

			return zhRegExpGreedy(rs, 'ui')
		},

		() => {
			let k = escapeStringRegexp(input.replace(matchOperatorsAndPunctuationRegex, ''));
			rs = `\^(?:${k})\$`;

			return zhRegExpGreedy(rs, 'ui')
		},

		() => {
			let k = input
				.replace(matchOperatorsAndPunctuationRegex, '')
				.replace(/[-\\\/]/g, '')
			;
			rs = `\^(?:${k})\$`;

			return zhRegExpGreedy(rs, 'ui')
		},

	].some(function (fn)
	{
		try
		{
			re = fn()

			return true;
		}
		catch (e)
		{
			console.error(rs);

			if (!_err2)
			{
				console.error(e);
				_err2 = true;
			}
		}
	});

	if (bool && re)
	{
		return re;
	}

	return String(input);
}
