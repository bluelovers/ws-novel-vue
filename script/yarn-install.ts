/**
 * Created by user on 2019/5/2.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import console, { awaitImport, consoleDebug } from './util';

export = (async () => {

	let cmds = [
		'add',
		'regexp-cjk@latest',
		'cjk-conv@latest',
		'yarn-tool@latest',
	];

	consoleDebug.info(`yarn ${cmds.join(' ')}`);

	await CrossSpawn('yarn', cmds, {
		stdio: 'inherit'
	})
		.catch(e => {
			consoleDebug.error(e.message);
			return null
		})
	;

	cmds = [
		'install',
	];

	consoleDebug.info(`yarn-tool ${cmds.join(' ')}`);

	await CrossSpawn('yarn-tool', cmds, {
		stdio: 'inherit'
	})
		.catch(e => {
			consoleDebug.error(e.message);
			return null
		})
	;

})();