import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOProject } from '../type/oo-project'

export default async (
	tag?: string,
	time?: number
): Promise<OOAPIResult<OOProject>> => {
	let pathParameter = tag ? `publics/tag/${tag}` : `publics`
	pathParameter += `/${time ? time : ''}`

	return api<OOProject>({
		resource: 'projects',
		pathParameter,
		method: 'GET'
	})
}
