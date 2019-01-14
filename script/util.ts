/**
 * Created by user on 2019/1/14/014.
 */

import { Console2 } from 'debug-color2';

const console = new Console2();

console.inspectOptions = console.inspectOptions || {};
console.inspectOptions.colors = true;
console.enabledColor = true;

export { console }

export default console
