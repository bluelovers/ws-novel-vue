/**
 * Created by user on 2019/5/1.
 */

import FastGlob = require('fast-glob');
import ProjectConfig, { ProjectRoot, srcPath } from '../../project.config';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import console from '../util';

FastGlob.sync<string>([
	'**/*.vue'
], {
	cwd: srcPath,
	absolute: true,
})
.forEach(file => {

	let dts = file + '.d.ts';

	if (fs.pathExistsSync(dts))
	{
		console.debug(`remove ${dts}`);
		fs.removeSync(dts)
	}
})