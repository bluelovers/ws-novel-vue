"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const cross_spawn_extra_1 = require("cross-spawn-extra");
const path = require("path");
const cwd = path.join(__dirname, '..');
module.exports = (async () => {
    await Promise.resolve().then(() => __importStar(require('./build/yarn-list')));
    await Promise.resolve().then(() => __importStar(require('./fetch-api-json')));
    await cross_spawn_extra_1.async('yarn', [
        'run',
        'build-base',
        '--',
        '--report',
    ], {
        cwd,
        stdio: 'inherit',
    });
    await Promise.resolve().then(() => __importStar(require('./build/copy-missed-static')));
    await Promise.resolve().then(() => __importStar(require('./build/check-dist')));
})();
//# sourceMappingURL=build.js.map