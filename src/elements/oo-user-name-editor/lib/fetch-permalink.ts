import getPermalink from '../../../lib/oo-api-get-permalink'
import putPermalink from '../../../lib/oo-api-put-permalink'
import {OOPermalink} from '../../../type/oo-permalink'

export const permalinks = async (path: string): Promise<boolean | OOPermalink> => {
	const res = await getPermalink(path)
	const {response} = res
	if (Array.isArray(response)) {
		const [item] = response
		return item
	}
	return false
}

export const usable = async (path: string): Promise<boolean> => {
	const res = await getPermalink(path)
	const {status} = res
	if (status === 404) {
		return true
	}
	return false
}

export const put = async (path: string): Promise<boolean | OOPermalink> => {
	const res = await putPermalink(path)
	const {response} = res
	if (Array.isArray(response)) {
		const [item] = response
		return item
	}
	return false
}
