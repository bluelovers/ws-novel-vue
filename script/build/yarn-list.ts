/**
 * Created by user on 2019/1/13/013.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import ProjectConfig, { ProjectRoot } from '../../project.config';
import { array_unique, array_unique_overwrite } from 'array-hyper-unique'

import PackageJson = require('../../package.json');

export = CrossSpawn('yarn', [
	'list',
	array_unique([
		...Object.keys(PackageJson.dependencies),
		'deepmerge-plus',
		'typescript',
	]).join('|'),
], {
	cwd: ProjectConfig.ProjectRoot,
	stdio: 'inherit',
})
