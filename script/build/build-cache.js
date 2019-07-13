"use strict";
/**
 * Created by user on 2019/2/2/002.
 */
const tslib_1 = require("tslib");
const fs = require("fs-extra");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const lib_1 = require("node-novel-info/lib");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("../util"));
const cache_loader_1 = require("@node-novel/cache-loader");
function cacheBuildJson() {
    const novelStatJson = fs.readJSONSync(path.join(project_config_1.default.ProjectRoot, 'public/static/novel-stat.json'));
    let output = {
        meta: novelStatJson.meta,
        buildTimestamp: cache_loader_1.createMoment().valueOf(),
    };
    fs.outputJSONSync(path.join(project_config_1.default.ProjectRoot, 'src', 'setting', 'build.json'), output, {
        spaces: '\t',
    });
    util_1.default.success(`[cache] build.json`);
    util_1.default.dir(output);
    util_1.default.log('buildTimestamp', lib_1.moment(output.buildTimestamp).format());
    util_1.default.log('meta.todayTimestamp', lib_1.moment(output.meta.todayTimestamp).format());
}
module.exports = cacheBuildJson();
