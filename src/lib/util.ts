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

		return {
			referrer,
			url,
			host,
			hostID,
			keyword,
			keywords: keywords.filter(v => v),
		}
	}
	catch (e)
	{
		console.error('referrer_search', e, referrer);
	}
}

let r = referrer_search('https://www.google.com/search?q=%E7%8F%BE%E5%AE%9F%E4%B8%BB%E7%BE%A9%E5%8B%87%E8%80%85%E3%81%AE%E5%A4%A7%E5%9B%BD%E5%BB%BA%E9%80%A0%E8%A8%98&rlz=1C1SQJL_zh-TWTW836TW836&oq=%E7%8F%BE%E5%AE%9F%E4%B8%BB%E7%BE%A9%E5%8B%87%E8%80%85%E3%81%AE%E5%A4%A7%E5%9B%BD%E5%BB%BA%E9%80%A0%E8%A8%98&aqs=chrome..69i57.1476552j0j1&sourceid=chrome&ie=UTF-8&tbs=lr:lang_1zh-CN%7Clang_1zh-TW&lr=lang_zh-CN%7Clang_zh-TW');

console.dir(r);
