import StrUtil from 'str-util';
import { array_unique } from 'array-hyper-unique'

export function toHalfWidthLocaleLowerCase(s: string)
{
	return StrUtil.toHalfWidth(s).toLocaleLowerCase()
}

export function handleSearchText(s: string)
{
	return s
		.replace(/的|之/g, 'の')
		.replace(/與|与/g, 'と')
	;
}
