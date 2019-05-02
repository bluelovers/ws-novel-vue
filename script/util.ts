/**
 * Created by user on 2019/1/14/014.
 */

import { Console2 } from 'debug-color2';
import Bluebird = require('bluebird');

export const console = new Console2();

console.inspectOptions = console.inspectOptions || {};
console.inspectOptions.colors = true;
console.enabledColor = true;

export const consoleDebug = new Console2(null, {
	label: true,
	time: true,
});

consoleDebug.inspectOptions = console.inspectOptions || {};
consoleDebug.inspectOptions.colors = true;
consoleDebug.enabledColor = true;

export function awaitImport<T>(m: T, skipError?: boolean)
{
	let p = Bluebird.resolve().then(async function ()
	{
		let r = await m;
		//console.log('import', r);

		// @ts-ignore
		if (m && m.default)
		{
			// @ts-ignore
			let r2 = await m.default;

			//console.log('import.default', r2);
		}

		return m;
	});

	if (skipError)
	{
		// @ts-ignore
		p = p.catch(e => console.error(e))
	}

	return p;
}

export default console
