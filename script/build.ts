/**
 * Created by user on 2019/1/11/011.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import console from './util';
import ProjectConfig, { ProjectRoot } from '../project.config';

const cwd = ProjectConfig.ProjectRoot;

export = (async () =>
{
	await import('./build/yarn-list').catch(e => console.error(e));

	/*
	await CrossSpawn('node', [
		path.resolve(__dirname, './fetch-api-json'),
	], {
		cwd,
		stdio: 'inherit',
	})
	;
	*/
	await import('./fetch-api-json').catch(e => console.error(e));

	//await Bluebird.delay(5000);

	await import('./build/build-cache').catch(e => console.error(e));

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
		//env: process.env,
	})
	;

	await import('./build/copy-missed-static');
	await import('./build/check-dist');

})();
