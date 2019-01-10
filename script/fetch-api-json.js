"use strict";
/**
 * Created by user on 2019/1/10/010.
 */
const cross_fetch_1 = require("cross-fetch");
const Bluebird = require("bluebird");
const fs = require("fs-extra");
const path = require("path");
// @ts-ignore
cross_fetch_1.default.Promise = Bluebird;
module.exports = cross_fetch_1.default('https://gitee.com/bluelovers/novel/raw/master/novel-stat.json')
    .then(res => res.json())
    .then(json => {
    let s = JSON.stringify(json, null, 2);
    let root = path.join(__dirname, '..');
    return Bluebird.all([
        fs.outputFile(path.join(root, 'public', 'static', 'novel-stat.json'), s),
        fs.outputFile(path.join(root, 'dist', 'static', 'novel-stat.json'), s),
    ])
        .tap(function () {
        console.info(`saved`, 'novel-stat.json');
    });
});
//# sourceMappingURL=fetch-api-json.js.map