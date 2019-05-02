/**
 * Created by user on 2019/5/2.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import console, { awaitImport } from './util';

export = (async () => {

	let cmds = [
		'add',
		'regexp-cjk@latest',
		'cjk-conv@latest',
	];

	console.info(`yarn ${cmds.join(' ')}`);

	await CrossSpawn('yarn', cmds, {
		stdio: 'inherit'
	})
		.catch(e => {
			console.error(e.message);
			return null
		})
	;

})();