"use strict";
/**
 * Created by user on 2019/5/1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
const project_config_1 = require("../../project.config");
const fs = require("fs-extra");
const util_1 = tslib_1.__importDefault(require("../util"));
fast_glob_1.default.sync([
    '**/*.vue'
], {
    cwd: project_config_1.srcPath,
    absolute: true,
})
    .forEach(file => {
    let dts = file + '.d.ts';
    if (fs.pathExistsSync(dts)) {
        util_1.default.debug(`remove ${dts}`);
        fs.removeSync(dts);
    }
});
