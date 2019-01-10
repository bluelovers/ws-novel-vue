/**
 * Created by user on 2019/1/11/011.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import sortPackageJson = require('sort-package-json');

const cwd = path.join(__dirname, '..');

(async () =>
{

	await CrossSpawn('yarn', [
		'run',
		'sort-package-json',
		path.join(cwd, 'package.json'),
	], {
		cwd,
		stdio: 'inherit',
	})
	;

})();
