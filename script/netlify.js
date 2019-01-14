"use strict";
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("./util"));
let { INCOMING_HOOK_TITLE, INCOMING_HOOK_BODY, } = process.env;
util_1.default.info(`NetlifyEnv:`);
util_1.default.dir({
    INCOMING_HOOK_TITLE,
    INCOMING_HOOK_BODY,
});
module.exports = {
    INCOMING_HOOK_TITLE,
    INCOMING_HOOK_BODY,
};
//# sourceMappingURL=netlify.js.map