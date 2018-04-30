import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOProject } from '../type/oo-project'

export default async (uid: string): Promise<OOAPIResult<OOProject>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		pathParameter: `${uid}/forks`,
		method: 'POST'
	})

	return ooapiRes
}
