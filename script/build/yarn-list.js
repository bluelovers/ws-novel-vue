"use strict";
/**
 * Created by user on 2019/1/13/013.
 */
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const array_hyper_unique_1 = require("array-hyper-unique");
const util_1 = tslib_1.__importDefault(require("../util"));
const PackageJson = require("../../package.json");
module.exports = cross_spawn_extra_1.async('yarn', [
    'list',
    '--pattern',
    array_hyper_unique_1.array_unique([
        ...Object.keys(PackageJson.dependencies),
        'deepmerge-plus',
        '*typescript*',
        '*ts-node*',
        '*ts-loader*',
        'vue*',
        '*webpack*',
        '*terser*',
    ])
        .filter(v => !/lodash|firebase|@types/i.test(v))
        .join('|'),
], {
    cwd: project_config_1.default.ProjectRoot,
    stdio: 'inherit',
})
    .tap(async function () {
    return await cross_spawn_extra_1.sync('yarn', [
        'run',
        'vue',
        'info',
    ], {
        cwd: project_config_1.default.ProjectRoot,
        stdio: 'inherit',
    });
})
    .catch(e => util_1.default.error(e));
