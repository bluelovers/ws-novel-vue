/**
 * Created by user on 2019/1/13/013.
 */

import FastGlob = require('fast-glob');
import ProjectConfig, { ProjectRoot } from '../../project.config';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');

export = Bluebird.resolve(FastGlob.async<string>([
	'**',
], {
	cwd: ProjectConfig.distPath,
	deep: true,
	onlyFiles: true,
}))
	.tap(function (ls)
	{
		console.log(`file in dist:`);
		console.log(ls);
	})
;
