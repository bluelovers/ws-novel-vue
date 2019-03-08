/**
 * Created by user on 2019/1/14/014.
 */

import { parseNetlifyEnv, getNetlifyEnv } from 'netlify-env2';
import {
	EnumNetlifyHookBodyGiteeAction,
	EnumNetlifyHookBodyGiteeHookName,
	EnumNetlifyHookBodyGiteeMergeStatus,
	EnumNetlifyHookBodyGiteePullRequestStatus,
} from 'netlify-env2/lib/gitee';
import console, { awaitImport } from './util';
import Bluebird = require('bluebird');

export const env = parseNetlifyEnv(getNetlifyEnv());

(async () => {

	console.debug(`NetlifyEnv：`);
	console.gray(`-`.repeat(10));
	console.dir(env, {
		depth: 5,
		colors: true,
	});

	console.gray(`-`.repeat(10));

	console.info(`check env and hook`);
	console.gray(`-`.repeat(10));

	let bool = await skipBuild();

	console.debug(`skipBuild: ${bool}`);

	if (bool)
	{
		console.warn(`SKIP BUILD`);
		return false;
	}

	console.gray(`-`.repeat(10));

	console.info(`START BUILD`);

	console.gray(`-`.repeat(10));

	await import('./build').then(awaitImport);

})();

export function skipBuild()
{
	if (env.INCOMING_HOOK_BODY_JSON)
	{
		let json = env.INCOMING_HOOK_BODY_JSON;

		console.info(`hook_name: ${json.hook_name}`);
		console.info(`action: ${json.action}`);
		console.info(`state: ${json.state}`);

		if (json.hook_name === EnumNetlifyHookBodyGiteeHookName.MERGE_REQUEST_HOOKS)
		{
			switch (json.action)
			{
				case EnumNetlifyHookBodyGiteeAction.CREATE:
				case EnumNetlifyHookBodyGiteeAction.UPDATE:
					return true;
					break;
				case EnumNetlifyHookBodyGiteeAction.MERGE:
					console.info(`merge_status: ${json.merge_status}`);

					if (json.state !== EnumNetlifyHookBodyGiteePullRequestStatus.MERGED)
					{
						return true;
					}
					else
					{
						console.info(`延遲 5 秒後才開始進行 build`);

						return Bluebird.delay(5000).thenReturn(false);
					}

					break;
			}
		}
		// @ts-ignore
		else if (json.event_type === 'merge_request')
		{
			// @ts-ignore
			if (json.object_attributes && json.object_attributes.state == 'merged')
			{
				return Bluebird.delay(5000).thenReturn(false);
			}
		}
		// @ts-ignore
		else if (json.event_name === 'push')
		{
			// @ts-ignore
			if (json.total_commits_count && json.ref == 'refs/heads/master')
			{
				return Bluebird.delay(5000).thenReturn(false);
			}
		}

		return true;
	}

	return null;
}
