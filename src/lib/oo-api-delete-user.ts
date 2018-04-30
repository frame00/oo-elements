import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'

export default async (uid: string): Promise<OOAPIResult<boolean>> =>
	api<boolean>({
		resource: 'users',
		pathParameter: uid,
		method: 'DELETE'
	})
