"use strict";
const NetlifyEnv = require("netlify-env");
let { INCOMING_HOOK_TITLE, INCOMING_HOOK_BODY, } = NetlifyEnv;
console.log(`NetlifyEnv:`);
console.log({
    INCOMING_HOOK_TITLE,
    INCOMING_HOOK_BODY,
});
module.exports = NetlifyEnv;
//# sourceMappingURL=netlify.js.map