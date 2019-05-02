/**
 * Created by user on 2019/5/2.
 */

import { async as CrossSpawn } from 'cross-spawn-extra';
import Bluebird = require('bluebird');

export = CrossSpawn('yarn', [
	'add',
	'regexp-cjk@latest',
	'cjk-conv@latest',
], {
	stdio: 'inherit'
})
	.catch(e => {
		console.error(e.message);
		return null
	})
;
