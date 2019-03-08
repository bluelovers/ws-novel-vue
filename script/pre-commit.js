"use strict";
/**
 * Created by user on 2019/1/11/011.
 */
const cross_spawn_extra_1 = require("cross-spawn-extra");
const path = require("path");
const cwd = path.join(__dirname, '..');
module.exports = (async () => {
    await cross_spawn_extra_1.async('yarn', [
        'run',
        'sort-package-json',
        path.join(cwd, 'package.json'),
    ], {
        cwd,
        stdio: 'inherit',
    });
})();
//# sourceMappingURL=pre-commit.js.map