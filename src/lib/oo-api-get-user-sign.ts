import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'

export default async (): Promise<OOAPIResult<string>> => {
	const ooapiRes = await api<string>({
		resource: 'users',
		pathParameter: 'sign',
		method: 'GET'
	})

	return ooapiRes
}
