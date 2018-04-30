import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOMessage } from '../type/oo-message'

interface Options {
	limit?: number
}

export default async (
	uid: string,
	time?: number,
	opts?: Options
): Promise<OOAPIResult<OOMessage>> => {
	const query =
		opts && typeof opts.limit === 'number' ? { limit: ~~opts.limit } : false
	const ooapiRes = await api<OOMessage>({
		resource: 'projects',
		pathParameter: `${uid}/messages/${time ? time : ''}`,
		query,
		method: 'GET'
	})

	return ooapiRes
}
