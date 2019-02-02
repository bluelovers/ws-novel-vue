/**
 * Created by user on 2019/2/2/002.
 */

import novelStatJson = require('../../public/static/novel-stat.json');
import fs = require('fs-extra');
import ProjectConfig from '../../project.config';
import { moment } from 'node-novel-info/lib';
import path = require('path');
import console from '../util';
import { createMoment } from '@node-novel/cache-loader';

let output = {
	meta: novelStatJson.meta,
	buildTimestamp: createMoment().valueOf(),
};

fs.outputJSONSync(path.join(ProjectConfig.ProjectRoot, 'src', 'setting', 'build.json'), output, {
	spaces: '\t',
});

console.success(`[cache] build.json`);
