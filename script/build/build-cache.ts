/**
 * Created by user on 2019/2/2/002.
 */

import fs = require('fs-extra');
import ProjectConfig from '../../project.config';
import { moment } from 'node-novel-info/lib';
import path = require('path');
import console from '../util';
import { createMoment } from '@node-novel/cache-loader';

function cacheBuildJson()
{
	const novelStatJson = fs.readJSONSync(path.join(ProjectConfig.ProjectRoot, 'public/static/novel-stat.json')) as typeof import('../../public/static/novel-stat.json');

	let output = {
		meta: novelStatJson.meta,
		buildTimestamp: createMoment().valueOf(),
	};

	fs.outputJSONSync(path.join(ProjectConfig.ProjectRoot, 'src', 'setting', 'build.json'), output, {
		spaces: '\t',
	});

	console.success(`[cache] build.json`);

	console.dir(output);

	console.log('buildTimestamp', moment(output.buildTimestamp).format());
	console.log('meta.todayTimestamp', moment(output.meta.todayTimestamp).format());
}

export = cacheBuildJson()
