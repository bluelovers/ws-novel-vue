
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
