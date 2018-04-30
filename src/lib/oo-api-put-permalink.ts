import api from '../lib/oo-api'
import { OOPermalink } from '../type/oo-permalink'
import { OOAPIResult } from '../type/oo-api'

export default async (slug: string): Promise<OOAPIResult<OOPermalink>> => {
	const ooapiRes = await api<OOPermalink>({
		resource: 'permalinks',
		pathParameter: slug,
		method: 'PUT'
	})

	return ooapiRes
}
