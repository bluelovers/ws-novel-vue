/**
 * Created by user on 2019/5/26.
 */

import fs from 'fs-extra';
import FastGlob = require('fast-glob');
import path, { ParsedPath } from 'path';
import Bluebird from 'bluebird';
import { console, consoleDebug } from '../util';

export const enum EnumParsedPathExt
{
	ts = '.ts',
	dts = '.d.ts',
	js = '.js',
	map = '.map',
}

const ROOT = path.join(__dirname, '../..');

export function removeBadIdeaJs(mode?: boolean)
{
	consoleDebug.debug(`removeBadIdeaJs`, mode);

	return Bluebird
		.resolve(FastGlob<string>([
			'**/*.js',
			'**/*.d.ts',
			//'**/*.map',
			'!**/shims-*.*',
			'!setting/*',
		], {
			cwd: path.join(ROOT, 'src'),
			absolute: true,
		}))
		.map(async (item, index, arrayLength) => {

			let info = pathParse(item);
			let bool: boolean;

			let target = item;

			if (info.ext === EnumParsedPathExt.js || info.ext === EnumParsedPathExt.dts)
			{
				if (await fileExists(path.join(info.dir, info.name)))
				{
					bool = true
				}
				else if (mode && await fileExists(path.join(info.dir, info.name + '.ts')))
				{
					bool = true
				}
			}
			else if (info.ext === EnumParsedPathExt.map)
			{
				bool = true
			}

			if (bool)
			{
				await fs.remove(target);

				consoleDebug.warn(`deleted`, path.relative(ROOT, target));
			}
			else
			{
				consoleDebug.log(info);
			}
		})
	;
}

export function pathParse(item: string): ParsedPath & {
	ext: string | EnumParsedPathExt;
}
{
	let info = path.parse(item);

	if (info.ext === EnumParsedPathExt.ts && info.name.match(/^(.+)(\.d)$/))
	{
		info.ext = RegExp.$2 + info.ext;
		info.name = RegExp.$1;
	}

	return info
}

export function fileExists(file: string)
{
	return fs.stat(file)
		.then(stat => {
			return stat.isFile()
		})
		.catch(e => false)
}

export default removeBadIdeaJs(process.argv.includes('--mode2'))

