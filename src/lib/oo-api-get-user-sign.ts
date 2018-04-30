import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'

export default async (): Promise<OOAPIResult<string>> =>
	api<string>({
		resource: 'users',
		pathParameter: 'sign',
		method: 'GET'
	})
