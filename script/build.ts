/**
 * Created by user on 2019/1/11/011.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');

const cwd = path.join(__dirname, '..');

(async () =>
{
	await import('./build/yarn-list');

	await CrossSpawn('node', [
		path.join(__dirname, './fetch-api-json'),
	], {
		cwd,
		stdio: 'inherit',
	})
	;

	await CrossSpawn('yarn', [
		'run',
		'build-base',
		'--',
		'--report',
		//'--client-log-level',
		//'none',
	], {
		cwd,
		stdio: 'inherit',
	})
	;

	await import('./build/copy-missed-static');
	await import('./build/check-dist');

})();

