type Picture = string | {
	data: {
		url: string
	}
}

export default (picture: Picture): string => {
	if (picture === undefined || picture === null) {
		return ''
	}
	if (typeof picture === 'string') {
		return picture
	}
	if (typeof picture === 'object' && picture.data && picture.data.url) {
		return picture.data.url
	}
}
