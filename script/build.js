"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_extra_1 = require("cross-spawn-extra");
const fs = require("fs-extra");
const path = require("path");
const cwd = path.join(__dirname, '..');
(async () => {
    await cross_spawn_extra_1.async('node', [
        path.join(__dirname, './fetch-api-json'),
    ], {
        cwd,
        stdio: 'inherit',
    });
    await cross_spawn_extra_1.async('yarn', [
        'run',
        'build-base',
        '--',
        '--report',
    ], {
        cwd,
        stdio: 'inherit',
    });
    await fs.copy(path.join(cwd, 'public'), path.join(cwd, 'dist'), {
        overwrite: false,
        errorOnExist: false,
        recursive: true,
    })
        .then(function () {
        console.log('copy', 'public => dist');
    });
})();
//# sourceMappingURL=build.js.map