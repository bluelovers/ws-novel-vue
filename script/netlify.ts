/**
 * Created by user on 2019/1/14/014.
 */

import NetlifyEnv = require('netlify-env');

let {
	INCOMING_HOOK_TITLE,
	INCOMING_HOOK_BODY,
} = NetlifyEnv;

console.log(`NetlifyEnv:`);

console.log({
	INCOMING_HOOK_TITLE,
	INCOMING_HOOK_BODY,
});

export = NetlifyEnv

