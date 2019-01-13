"use strict";
const tslib_1 = require("tslib");
const FastGlob = require("fast-glob");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const Bluebird = require("bluebird");
module.exports = Bluebird.resolve(FastGlob.async([
    '**',
], {
    cwd: project_config_1.default.distPath,
    deep: true,
    onlyFiles: true,
}))
    .tap(function (ls) {
    console.log(`file in dist:`);
    console.log(ls);
});
//# sourceMappingURL=check-dist.js.map