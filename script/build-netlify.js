"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const netlify_env2_1 = require("netlify-env2");
const gitee_1 = require("netlify-env2/lib/gitee");
const util_1 = tslib_1.__importDefault(require("./util"));
const Bluebird = require("bluebird");
exports.env = netlify_env2_1.parseNetlifyEnv(netlify_env2_1.getNetlifyEnv());
(async () => {
    util_1.default.debug(`NetlifyEnv：`);
    util_1.default.gray(`-`.repeat(10));
    util_1.default.dir(exports.env);
    util_1.default.gray(`-`.repeat(10));
    util_1.default.info(`check env and hook`);
    util_1.default.gray(`-`.repeat(10));
    let bool = await skipBuild();
    util_1.default.debug(`skipBuild: ${bool}`);
    if (bool) {
        util_1.default.warn(`SKIP BUILD`);
        return false;
    }
    util_1.default.gray(`-`.repeat(10));
    util_1.default.info(`START BUILD`);
    util_1.default.gray(`-`.repeat(10));
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build')));
})();
function skipBuild() {
    if (exports.env.INCOMING_HOOK_BODY_JSON) {
        let json = exports.env.INCOMING_HOOK_BODY_JSON;
        util_1.default.info(`hook_name: ${json.hook_name}`);
        util_1.default.info(`action: ${json.action}`);
        util_1.default.info(`state: ${json.state}`);
        if (json.hook_name === gitee_1.EnumNetlifyHookBodyGiteeHookName.MERGE_REQUEST_HOOKS) {
            switch (json.action) {
                case gitee_1.EnumNetlifyHookBodyGiteeAction.CREATE:
                case gitee_1.EnumNetlifyHookBodyGiteeAction.UPDATE:
                    return true;
                    break;
                case gitee_1.EnumNetlifyHookBodyGiteeAction.MERGE:
                    util_1.default.info(`merge_status: ${json.merge_status}`);
                    if (json.state !== gitee_1.EnumNetlifyHookBodyGiteePullRequestStatus.MERGED) {
                        return true;
                    }
                    else {
                        util_1.default.info(`延遲 5 秒後才開始進行 build`);
                        return Bluebird.delay(5000).thenReturn(false);
                    }
                    break;
            }
            return true;
        }
    }
    return null;
}
exports.skipBuild = skipBuild;
//# sourceMappingURL=build-netlify.js.map