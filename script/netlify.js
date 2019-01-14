"use strict";
let { INCOMING_HOOK_TITLE, INCOMING_HOOK_BODY, } = process.env;
console.log(`NetlifyEnv:`);
console.log({
    INCOMING_HOOK_TITLE,
    INCOMING_HOOK_BODY,
});
module.exports = {
    INCOMING_HOOK_TITLE,
    INCOMING_HOOK_BODY,
};
//# sourceMappingURL=netlify.js.map