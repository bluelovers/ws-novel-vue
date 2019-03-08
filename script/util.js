"use strict";
/**
 * Created by user on 2019/1/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug_color2_1 = require("debug-color2");
const Bluebird = require("bluebird");
const console = new debug_color2_1.Console2();
exports.console = console;
console.inspectOptions = console.inspectOptions || {};
console.inspectOptions.colors = true;
console.enabledColor = true;
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
        p = p.catch(e => console.error(e));
    }
    return p;
}
exports.awaitImport = awaitImport;
exports.default = console;
//# sourceMappingURL=util.js.map