import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOUserConnectStripe } from '../type/oo-user'

export default async (
	uid: string,
	code: string,
	test?: boolean
): Promise<OOAPIResult<OOUserConnectStripe>> => {
	const body = { code }
	return api<OOUserConnectStripe>({
		resource: 'users',
		pathParameter: `${uid}/connect/stripe${test === false ? '/x' : ''}`,
		body,
		method: 'POST'
	})
}
