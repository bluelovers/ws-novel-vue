import { zhRegExp } from 'regexp-cjk';
import { toHalfWidthLocaleLowerCase } from '@/lib/conv';
import { array_unique } from 'array-hyper-unique'

let _err: boolean;
let _err2: boolean;

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

export function zhRegExpGreedy(input: unknown, flags?: string)
{
	const zhRegExp = getZhRegExp();

	if (Array.isArray(input))
	{
		input = input.join('|')
	}

	return new zhRegExp(input as string, flags || '', {
		greedyTable: true,
	});
}

export function zhRegExpGreedyMatchWords(input: string)
{
	try
	{
		let k = input.replace(/[|\\{}()\[\]^$+*?.]/g, '\\$1');

		let ks = array_unique([
			k,
			toHalfWidthLocaleLowerCase(k),
		]).join('|');

		let rs = `\^(?:${ks})\$`;

		let k2 = `\^(${k})\$`;

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
