import getUser from './oo-api-get-user'
import toMap from './extensions-to-map'
import {OOUserWithMapedExtensions} from '../type/oo-user'

export default async (iam: string): Promise<OOUserWithMapedExtensions | boolean> => {
	if (typeof iam !== 'string' || iam === '') {
		return false
	}
	const users = await getUser(iam)
	const {response} = users
	if (Array.isArray(response)) {
		const [user] = response
		const extensions = toMap(user)
		return {...user, ...{MapedExtensions: extensions}}
	}
	return false
}
