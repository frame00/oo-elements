import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOUser } from '../type/oo-user'

export default async (uid: string): Promise<OOAPIResult<OOUser>> => {
	const ooapiRes = await api<OOUser>({
		resource: 'users',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
