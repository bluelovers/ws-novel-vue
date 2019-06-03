
import punc = require('unicode-punctuation-regex');

export const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/ug;
export const matchPunctuationRegex = rePunctuation();
export const matchOperatorsAndPunctuationRegex = reOperatorsAndPunctuationRegex();

function rePunctuation()
{
	let re: RegExp;

	try
	{
		/**
		 * @BUG webpack + firefox will crash
		 */
		//re = /\p{Punctuation}/ug

		if (!re.test('“”'))
		{
			throw new Error();
		}
	}
	catch (e)
	{
		re = new RegExp(punc.source, 'ug');
	}

	return re
}

function reOperatorsAndPunctuationRegex()
{
	let source = matchOperatorsRegex.source + '|' + matchPunctuationRegex.source;

	return new RegExp(source, 'ug')
}
