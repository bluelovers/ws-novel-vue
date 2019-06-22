"use strict";
/**
 * Created by user on 2019/5/26.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const FastGlob = require("fast-glob");
const path_1 = tslib_1.__importDefault(require("path"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("../util");
var EnumParsedPathExt;
(function (EnumParsedPathExt) {
    EnumParsedPathExt["ts"] = ".ts";
    EnumParsedPathExt["dts"] = ".d.ts";
    EnumParsedPathExt["js"] = ".js";
    EnumParsedPathExt["map"] = ".map";
})(EnumParsedPathExt = exports.EnumParsedPathExt || (exports.EnumParsedPathExt = {}));
const ROOT = path_1.default.join(__dirname, '../..');
function removeBadIdeaJs(mode) {
    util_1.consoleDebug.debug(`removeBadIdeaJs`, mode);
    return bluebird_1.default
        .resolve(FastGlob([
        '**/*.js',
        '**/*.d.ts',
        //'**/*.map',
        '!**/shims-*.*',
        '!setting/*',
    ], {
        cwd: path_1.default.join(ROOT, 'src'),
        absolute: true,
    }))
        .map(async (item, index, arrayLength) => {
        let info = pathParse(item);
        let bool;
        let target = item;
        if (info.ext === ".js" /* js */ || info.ext === ".d.ts" /* dts */) {
            if (await fileExists(path_1.default.join(info.dir, info.name))) {
                bool = true;
            }
            else if (mode && await fileExists(path_1.default.join(info.dir, info.name + '.ts'))) {
                bool = true;
            }
        }
        else if (info.ext === ".map" /* map */) {
            bool = true;
        }
        if (bool) {
            await fs_extra_1.default.remove(target);
            util_1.consoleDebug.warn(`deleted`, path_1.default.relative(ROOT, target));
        }
        else {
            util_1.consoleDebug.log(info);
        }
    });
}
exports.removeBadIdeaJs = removeBadIdeaJs;
function pathParse(item) {
    let info = path_1.default.parse(item);
    if (info.ext === ".ts" /* ts */ && info.name.match(/^(.+)(\.d)$/)) {
        info.ext = RegExp.$2 + info.ext;
        info.name = RegExp.$1;
    }
    return info;
}
exports.pathParse = pathParse;
function fileExists(file) {
    return fs_extra_1.default.stat(file)
        .then(stat => {
        return stat.isFile();
    })
        .catch(e => false);
}
exports.fileExists = fileExists;
exports.default = removeBadIdeaJs(process.argv.includes('--mode2'));
