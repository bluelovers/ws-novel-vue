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

function fetchApiJson()
{
	console.success(`fetch`, 'novel-stat.json');

	return fetch(ProjectSetting.FETCH_API)
		.then(res => res.json())
		.then(async (json) =>
		{

			if (!json.novels || !json.mdconf)
			{
				console.error(`fail saved`, 'novel-stat.json');

				return Promise.reject(new Error([`fail saved`, 'novel-stat.json'].join(' ')))
			}

			let s = JSON.stringify(json, null, 2);

			let root = path.join(__dirname, '..');

			return Bluebird.all([
					await fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
					await fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.js'), s),
					await fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
					await fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.js'), s),
				])
				.tap(function ()
				{
					console.success(`saved`, 'novel-stat.json');

					return Bluebird.delay(1000);
				})
		})
	;
}

let p = fetchApiJson();

export = p
