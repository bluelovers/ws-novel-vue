"use strict";
/**
 * Created by user on 2019/5/2.
 */
const cross_spawn_extra_1 = require("cross-spawn-extra");
module.exports = cross_spawn_extra_1.async('yarn', [
    'add',
    'regexp-cjk@latest',
    'cjk-conv@latest',
], {
    stdio: 'inherit'
})
    .catch(e => {
    console.error(e.message);
    return null;
});
//# sourceMappingURL=yarn-install.js.map