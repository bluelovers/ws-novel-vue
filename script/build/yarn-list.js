"use strict";
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const array_hyper_unique_1 = require("array-hyper-unique");
const PackageJson = require("../../package.json");
module.exports = cross_spawn_extra_1.async('yarn', [
    'list',
    array_hyper_unique_1.array_unique([
        ...Object.keys(PackageJson.dependencies),
        'deepmerge-plus',
        'typescript',
    ]).join('|'),
], {
    cwd: project_config_1.default.ProjectRoot,
    stdio: 'inherit',
});
//# sourceMappingURL=yarn-list.js.map