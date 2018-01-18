import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOProject} from '../d/oo-project'

export default async (uid: string): Promise<OOAPIResult<OOProject>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
