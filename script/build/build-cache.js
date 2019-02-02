"use strict";
/**
 * Created by user on 2019/2/2/002.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const novelStatJson = require("../../public/static/novel-stat.json");
const fs = require("fs-extra");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const path = require("path");
const util_1 = tslib_1.__importDefault(require("../util"));
const cache_loader_1 = require("@node-novel/cache-loader");
let output = {
    meta: novelStatJson.meta,
    buildTimestamp: cache_loader_1.createMoment().valueOf(),
};
fs.outputJSONSync(path.join(project_config_1.default.ProjectRoot, 'src', 'setting', 'build.json'), output, {
    spaces: '\t',
});
util_1.default.success(`[cache] build.json`);
//# sourceMappingURL=build-cache.js.map