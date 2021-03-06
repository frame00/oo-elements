import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOProject } from '../type/oo-project'

export default async (uid: string): Promise<OOAPIResult<OOProject>> =>
	api<OOProject>({
		resource: 'projects',
		pathParameter: uid,
		method: 'GET'
	})
