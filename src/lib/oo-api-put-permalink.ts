import api from '../lib/oo-api'
import { OOPermalink } from '../type/oo-permalink'
import { OOAPIResult } from '../type/oo-api'

export default async (slug: string): Promise<OOAPIResult<OOPermalink>> =>
	api<OOPermalink>({
		resource: 'permalinks',
		pathParameter: slug,
		method: 'PUT'
	})
