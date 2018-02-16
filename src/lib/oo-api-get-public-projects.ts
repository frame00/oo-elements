import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOProject} from '../type/oo-project'

export default async (time?: number): Promise<OOAPIResult<OOProject>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		pathParameter: `publics/${time ? time : ''}`,
		method: 'GET'
	})

	return ooapiRes
}
