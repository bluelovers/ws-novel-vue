"use strict";
/**
 * Created by user on 2019/1/10/010.
 */
const tslib_1 = require("tslib");
const cross_fetch_1 = tslib_1.__importDefault(require("cross-fetch"));
const index_1 = tslib_1.__importDefault(require("../src/setting/index"));
const Bluebird = require("bluebird");
const fs = require("fs-extra");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("./util"));
// @ts-ignore
cross_fetch_1.default.Promise = Bluebird;
function fetchApiJson() {
    util_1.default.success(`fetch`, 'novel-stat.json');
    return cross_fetch_1.default(index_1.default.FETCH_API)
        .then(res => res.json())
        .then(async (json) => {
        if (!json.novels || !json.mdconf) {
            util_1.default.error(`fail saved`, 'novel-stat.json');
            return Promise.reject(new Error([`fail saved`, 'novel-stat.json'].join(' ')));
        }
        let s = JSON.stringify(json, null, 2);
        let root = path.join(__dirname, '..');
        return Bluebird.all([
            await fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
            await fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.js'), s),
            await fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
            await fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.js'), s),
        ])
            .tap(function () {
            util_1.default.success(`saved`, 'novel-stat.json');
            return Bluebird.delay(1000);
        });
    });
}
let p = fetchApiJson();
module.exports = p;
