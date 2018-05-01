import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { ReactionType } from '../type/reaction-type'
import store from './local-storage'

export default async (
	project: string,
	reaction: ReactionType
): Promise<false | OOAPIResult<boolean>> => {
	const { uid } = store
	if (!uid) {
		return false
	}
	return api<boolean>({
		resource: 'users',
		pathParameter: `${uid}/projects/${project}/reactions/${reaction}`,
		method: 'GET'
	})
}
