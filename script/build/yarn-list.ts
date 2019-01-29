/**
 * Created by user on 2019/1/13/013.
 */

import { async as CrossSpawn, sync as CrossSpawnSync } from 'cross-spawn-extra';
import ProjectConfig, { ProjectRoot } from '../../project.config';
import { array_unique, array_unique_overwrite } from 'array-hyper-unique'
import console from '../util';
import Bluebird = require('bluebird');

import PackageJson = require('../../package.json');

export = CrossSpawn('yarn', [
	'list',
	'--pattern',
	array_unique([
		...Object.keys(PackageJson.dependencies),
		'deepmerge-plus',
		'*typescript*',
		'*ts-node*',
		'*ts-loader*',
		'vue*',
		'*webpack*',
		'*terser*',
	])
		.filter(v => !/lodash|firebase|@types/i.test(v))
		.join('|')
	,
], {
	cwd: ProjectConfig.ProjectRoot,
	stdio: 'inherit',
})
	.tap(function ()
	{
		return CrossSpawnSync('yarn', [
				'run',
				'vue',
				'info',
			], {
				cwd: ProjectConfig.ProjectRoot,
				stdio: 'inherit',
			})
	})
	.catch(e => null)
;
