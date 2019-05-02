"use strict";
/**
 * Created by user on 2019/5/2.
 */
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const util_1 = tslib_1.__importDefault(require("./util"));
module.exports = (async () => {
    let cmds = [
        'add',
        'regexp-cjk@latest',
        'cjk-conv@latest',
    ];
    util_1.default.info(`yarn ${cmds.join(' ')}`);
    await cross_spawn_extra_1.async('yarn', cmds, {
        stdio: 'inherit'
    })
        .catch(e => {
        util_1.default.error(e.message);
        return null;
    });
})();
//# sourceMappingURL=yarn-install.js.map