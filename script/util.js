"use strict";
/**
 * Created by user on 2019/1/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug_color2_1 = require("debug-color2");
const Bluebird = require("bluebird");
exports.console = new debug_color2_1.Console2();
exports.console.inspectOptions = exports.console.inspectOptions || {};
exports.console.inspectOptions.colors = true;
exports.console.enabledColor = true;
exports.consoleDebug = new debug_color2_1.Console2(null, {
    label: true,
    time: true,
});
exports.consoleDebug.inspectOptions = exports.console.inspectOptions || {};
exports.consoleDebug.inspectOptions.colors = true;
exports.consoleDebug.enabledColor = true;
function awaitImport(m, skipError) {
    let p = Bluebird.resolve().then(async function () {
        let r = await m;
        //console.log('import', r);
        // @ts-ignore
        if (m && m.default) {
            // @ts-ignore
            let r2 = await m.default;
            //console.log('import.default', r2);
        }
        return m;
    });
    if (skipError) {
        // @ts-ignore
        p = p.catch(e => exports.console.error(e));
    }
    return p;
}
exports.awaitImport = awaitImport;
exports.default = exports.console;
//# sourceMappingURL=util.js.map