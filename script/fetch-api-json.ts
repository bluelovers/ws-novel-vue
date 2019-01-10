/**
 * Created by user on 2019/1/10/010.
 */

import fetch from 'cross-fetch';
import Bluebird = require('bluebird');
import fs = require('fs-extra');
import path = require('path');

// @ts-ignore
fetch.Promise = Bluebird;

export = fetch('https://gitee.com/bluelovers/novel/raw/master/novel-stat.json')
	.then(res => res.json())
	.then(json => {

		let s = JSON.stringify(json, null, 2);

		let root = path.join(__dirname, '..');

		return Bluebird.all([
			fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
			fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
		])
			.tap(function ()
			{
				console.info(`saved`, 'novel-stat.json');
			})
	})
;
