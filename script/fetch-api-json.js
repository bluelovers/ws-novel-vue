"use strict";
const tslib_1 = require("tslib");
const cross_fetch_1 = tslib_1.__importDefault(require("cross-fetch"));
const Bluebird = require("bluebird");
const fs = require("fs-extra");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("./util"));
cross_fetch_1.default.Promise = Bluebird;
module.exports = cross_fetch_1.default('https://gitee.com/bluelovers/novel/raw/master/novel-stat.json')
    .then(res => res.json())
    .then(json => {
    let s = JSON.stringify(json, null, 2);
    let root = path.join(__dirname, '..');
    return Bluebird.all([
        fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
        fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.js'), s),
        fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
        fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.js'), s),
    ])
        .tap(function () {
        util_1.default.success(`saved`, 'novel-stat.json');
    });
});
//# sourceMappingURL=fetch-api-json.js.map