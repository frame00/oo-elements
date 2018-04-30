import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOToken } from '../type/oo-token'

export default async (): Promise<OOAPIResult<OOToken>> =>
	api<OOToken>({
		resource: 'users',
		pathParameter: 'sign',
		method: 'DELETE'
	})
