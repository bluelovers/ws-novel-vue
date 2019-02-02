"use strict";
/**
 * Created by user on 2019/1/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug_color2_1 = require("debug-color2");
const console = new debug_color2_1.Console2();
exports.console = console;
console.inspectOptions = console.inspectOptions || {};
console.inspectOptions.colors = true;
console.enabledColor = true;
exports.default = console;
//# sourceMappingURL=util.js.map