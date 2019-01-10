"use strict";
/**
 * Created by user on 2019/1/11/011.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_extra_1 = require("cross-spawn-extra");
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
        'build-modern',
        '--',
        '--report',
    ], {
        cwd,
        stdio: 'inherit',
    });
})();
//# sourceMappingURL=build.js.map