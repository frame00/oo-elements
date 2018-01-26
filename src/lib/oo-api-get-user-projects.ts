import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOProject} from '../d/oo-project'

export default async (uid: string, time?: number): Promise<OOAPIResult<OOProject>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'users',
		pathParameter: `${uid}/projects${time ? `/${time}` : ''}`,
		method: 'GET'
	})

	return ooapiRes
}
