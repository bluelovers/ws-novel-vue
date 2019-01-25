/**
 * Created by user on 2019/1/10/010.
 */

import fetch from 'cross-fetch';
import ProjectSetting from '../src/setting/index';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');
import console from './util';

// @ts-ignore
fetch.Promise = Bluebird;

export = fetch(ProjectSetting.FETCH_API)
	.then(res => res.json())
	.then(json => {

		let s = JSON.stringify(json, null, 2);

		let root = path.join(__dirname, '..');

		return Bluebird.all([
			fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
				fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.js'), s),
			fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
				fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.js'), s),
		])
			.tap(function ()
			{
				console.success(`saved`, 'novel-stat.json');
			})
	})
;
