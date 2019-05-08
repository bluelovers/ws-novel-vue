import UString = require('uni-string');

export function img_unsplash(item?: number | string, width: number = 300, height: number = 200)
{
	if (!item)
	{
		item = Math.floor(Math.random() * 200) + 1
		//item = 'random'
	}

	if (typeof item === 'number')
	{
		item = `image=${item}`
	}
	else if (!item || typeof item !== 'string')
	{
		item = '';
	}

	return `https://unsplash.it/${width}/${height}?${item}`
}

export const enum EnumReferrerHostID
{
	google = 'google',
}

export function referrer_search(referrer?: string): {
	referrer: string,
	url: URL,
	host: string,
	hostID: string | EnumReferrerHostID,
	keyword: string,
	keywords: string[],
}
{
	referrer = referrer || document.referrer;

	if (!referrer)
	{
		console.log(`referrer`, referrer, document.referrer);

		return null;
	}

	try
	{
		let url = new URL(referrer);

		let keyword: string;
		let keywords: string[] = [];
		let host = url.host;
		let hostID: string | EnumReferrerHostID = host;

		if (url.host.includes(EnumReferrerHostID.google as any))
		{
			hostID = EnumReferrerHostID.google;

			let k = url.searchParams.get('q');

			if (k && k != 'null' && k != 'undefined')
			{
				keyword = k.trim();
				keywords.push(keyword);
				keywords.push(UString.slice(keyword, 0, -6).trim());
				//keywords.push(...keyword.split(/[\s+\-.$\{\}\[\]]+/));
			}
		}

		let ret = {
			referrer,
			url,
			host,
			hostID,
			keyword,
			keywords: keywords.filter(v => v),
		};

		console.log(`referrer:return`);
		console.dir(ret);

		return ret
	}
	catch (e)
	{
		console.error('referrer_search', e, referrer);
	}
}
