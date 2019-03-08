/**
 * Created by user on 2019/3/9.
 */

import fs = require('fs-extra');
import ProjectConfig from '../../project.config';
import { moment } from 'node-novel-info/lib';
import path = require('path');
import console from '../util';
import { createMoment } from '@node-novel/cache-loader';
import { buildOPDS } from '@node-novel/opds-builder'

async function runBuild()
{
	await buildOPDS(path.join(ProjectConfig.ProjectRoot, 'public/static/novel-stat.json'), path.join(ProjectConfig.ProjectRoot, 'public/static/opds.xml'));

	console.success(`[build] opds.xml`);
}

export = runBuild()
