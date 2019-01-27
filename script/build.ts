/**
 * Created by user on 2019/1/11/011.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import console from './util';

const cwd = path.join(__dirname, '..');

export = (async () =>
{
	await import('./build/yarn-list');

	/*
	await CrossSpawn('node', [
		path.resolve(__dirname, './fetch-api-json'),
	], {
		cwd,
		stdio: 'inherit',
	})
	;
	*/
	await import('./fetch-api-json').catch(e => null);

	await CrossSpawn('yarn', [
		'run',
		'build-base',
		//'--',
		//'--report',
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
