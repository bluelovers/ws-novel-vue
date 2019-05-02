"use strict";
/**
 * Created by user on 2019/5/2.
 */
const cross_spawn_extra_1 = require("cross-spawn-extra");
const util_1 = require("./util");
module.exports = (async () => {
    let cmds = [
        'add',
        'regexp-cjk@latest',
        'cjk-conv@latest',
        'yarn-tool@latest',
    ];
    util_1.consoleDebug.info(`yarn ${cmds.join(' ')}`);
    await cross_spawn_extra_1.async('yarn', cmds, {
        stdio: 'inherit'
    })
        .catch(e => {
        util_1.consoleDebug.error(e.message);
        return null;
    });
    cmds = [
        'install',
    ];
    util_1.consoleDebug.info(`yarn-tool ${cmds.join(' ')}`);
    await cross_spawn_extra_1.async('yarn-tool', cmds, {
        stdio: 'inherit'
    })
        .catch(e => {
        util_1.consoleDebug.error(e.message);
        return null;
    });
})();
//# sourceMappingURL=yarn-install.js.map