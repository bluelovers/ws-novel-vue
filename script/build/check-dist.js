"use strict";
/**
 * Created by user on 2019/1/13/013.
 */
const tslib_1 = require("tslib");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const Bluebird = require("bluebird");
const util_1 = tslib_1.__importDefault(require("../util"));
module.exports = Bluebird.resolve(fast_glob_1.default([
    '**',
], {
    cwd: project_config_1.default.distPath,
    // @ts-ignore
    deep: true,
    onlyFiles: true,
}))
    .tap(function (ls) {
    util_1.default.info(`file in dist:`);
    util_1.default.info(ls);
});
