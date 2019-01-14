/**
 * Created by user on 2019/1/14/014.
 */

import console from './util';

let {
	INCOMING_HOOK_TITLE,
	INCOMING_HOOK_BODY,
} = process.env;

console.info(`NetlifyEnv:`);

console.dir({
	INCOMING_HOOK_TITLE,
	INCOMING_HOOK_BODY,
});

export = {
	INCOMING_HOOK_TITLE,
	INCOMING_HOOK_BODY,
}
