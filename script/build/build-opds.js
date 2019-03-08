"use strict";
/**
 * Created by user on 2019/3/9.
 */
const tslib_1 = require("tslib");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const path = require("path");
const util_1 = tslib_1.__importDefault(require("../util"));
const opds_builder_1 = require("@node-novel/opds-builder");
async function runBuild() {
    await opds_builder_1.buildOPDS(path.join(project_config_1.default.ProjectRoot, 'public/static/novel-stat.json'), path.join(project_config_1.default.ProjectRoot, 'public/static/opds.xml'));
    util_1.default.success(`[build] opds.xml`);
}
module.exports = runBuild();
//# sourceMappingURL=build-opds.js.map