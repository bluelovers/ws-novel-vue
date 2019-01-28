import zhRegExp from 'regexp-cjk';
import { toHalfWidthLocaleLowerCase } from '@/lib/conv';

export function getZhRegExp(): typeof zhRegExp
{
	try
	{
		// @ts-ignore
		let c: typeof import('regexp-cjk') = require('regexp-cjk');

		return c.zhRegExp
	}
	catch (e)
	{
		// @ts-ignore
		return RegExp
	}
}

export function zhRegExpGreedy(input: unknown, flags?: string)
{
	const zhRegExp = getZhRegExp();

	if (Array.isArray(input))
	{
		input = input.join('|')
	}

	return new zhRegExp(input as string, flags, {
		greedyTable: true,
	});
}

export function zhRegExpGreedyMatchWords(input: string)
{
	try
	{
		let k = input.replace(/[|\\{}()\[\]^$+*?.]/g, '\\$1');

		let ks = [
			k,
			toHalfWidthLocaleLowerCase(k),
		].join('|');

		return zhRegExpGreedy(`\^(?:${ks})\$`, 'i')
	}
	catch (e)
	{
		return String(input);
	}
}
