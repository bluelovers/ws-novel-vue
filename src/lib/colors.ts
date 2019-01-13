/**
 * Created by user on 2019/1/13/013.
 */

import colors from 'vuetify/lib/util/colors'

let _ls = Object.entries(colors);

export function randColor()
{
	if (!_ls.length)
	{
		_ls = Object.entries(colors);
	}

	let i = Math.floor(Math.random() * _ls.length);

	let [c1, data] = _ls.splice(i, 1)[0];

	let _ls2 = Object.keys(data);

	let i2 = Math.floor(Math.random() * _ls2.length);

	return {
		name: c1,
		sub: _ls2[i],
		key: c1 + '-' + _ls2[i]
	};
}
