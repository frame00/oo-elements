import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'

export default async (uid: string): Promise<OOAPIResult<boolean>> => {
	const ooapiRes = await api<boolean>({
		resource: 'users',
		pathParameter: uid,
		method: 'DELETE'
	})

	return ooapiRes
}
