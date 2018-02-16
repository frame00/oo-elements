import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOProject} from '../type/oo-project'

export default async (uid: string, time?: number): Promise<OOAPIResult<OOProject>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		pathParameter: `${uid}/forks/${time ? time : ''}`,
		method: 'GET'
	})

	return ooapiRes
}
