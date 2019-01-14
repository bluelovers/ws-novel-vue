/**
 * Created by user on 2019/1/13/013.
 */

import FastGlob = require('fast-glob');
import ProjectConfig, { ProjectRoot } from '../../project.config';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import console from '../util';

const copyOptions: fs.CopyOptions = {
	overwrite: false,
	errorOnExist: false,
	recursive: true,
};

export = Bluebird.resolve(FastGlob.async<string>([
	'**',

], {
	cwd: ProjectConfig.publicPath,
	deep: true,
	onlyFiles: true,
	//followSymlinkedDirectories: true,
	ignore: [
		'index.html',
		'index.htm',
	],
}))
	.tap(function ()
	{
		console.info('[copy]', 'check missed file');
	})
	.map(async function (file)
	{
		let target = path.join(ProjectConfig.distPath, file);
		let source = path.join(ProjectConfig.publicPath, file);

		const exists = await fs.pathExists(target);

		if (!exists)
		{
			await fs.copy(source, target, copyOptions);

			console.success('[copy]', file);
		}
		else
		{
			console.gray('[skip]', file);
		}
	})
	.tap(function ()
	{
		console.info('[copy]', 'done');
	})
;
