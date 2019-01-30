/**
 * Created by user on 2019/1/31/031.
 */

export function sortSeriesCallback<T>(fnArray: ((a: T, b: T) => number)[])
{
	fnArray = fnArray.filter(v => v);

	return function (a: T, b: T): number
	{
		let n: number = 0;
		fnArray.some(function (fn): boolean
		{
			// @ts-ignore
			return n = fn(a, b);
		});
		return n;
	}
}
