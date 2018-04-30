import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOProject } from '../type/oo-project'

export default async (
	uid: string,
	time?: number
): Promise<OOAPIResult<OOProject>> =>
	api<OOProject>({
		resource: 'users',
		pathParameter: `${uid}/projects${time ? `/${time}` : ''}`,
		method: 'GET'
	})
