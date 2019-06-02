import { matchPunctuationRegex, matchOperatorsRegex } from '../regex/const';

export function handleSearchText(b: string)
{
	return b
		.toLocaleLowerCase()
		.replace(matchPunctuationRegex, '')
		.replace(/[\s\u3000]+/g, '')
		;
}

export function handleSearchText2(b: string)
{
	return handleSearchText(b)
		.replace(matchOperatorsRegex, '')
		;
}
