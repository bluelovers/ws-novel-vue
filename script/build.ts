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

	await fs.copy(path.join(cwd, 'public'), path.join(cwd, 'dist'), {
		overwrite: false,
		errorOnExist: false,
		recursive: true,
	})
		.then(function ()
		{
			console.log('copy', 'public => dist');
		})
	;

})();

