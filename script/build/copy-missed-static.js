"use strict";
/**
 * Created by user on 2019/1/13/013.
 */
const tslib_1 = require("tslib");
const FastGlob = require("fast-glob");
const project_config_1 = tslib_1.__importDefault(require("../../project.config"));
const Bluebird = require("bluebird");
const fs = require("fs-extra");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("../util"));
const copyOptions = {
    overwrite: false,
    errorOnExist: false,
    recursive: true,
};
module.exports = Bluebird.resolve(FastGlob.async([
    '**',
], {
    cwd: project_config_1.default.publicPath,
    deep: true,
    onlyFiles: true,
    //followSymlinkedDirectories: true,
    ignore: [
        'index.html',
        'index.htm',
    ],
}))
    .tap(function () {
    util_1.default.info('[copy]', 'check missed file');
})
    .map(async function (file) {
    let target = path.join(project_config_1.default.distPath, file);
    let source = path.join(project_config_1.default.publicPath, file);
    const exists = await fs.pathExists(target);
    if (!exists) {
        await fs.copy(source, target, copyOptions);
        util_1.default.success('[copy]', file);
    }
    else {
        util_1.default.gray('[skip]', file);
    }
})
    .tap(function () {
    util_1.default.info('[copy]', 'done');
});
//# sourceMappingURL=copy-missed-static.js.map