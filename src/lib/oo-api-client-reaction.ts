import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOReaction } from '../type/oo-reaction'
import { ReactionType } from '../type/reaction-type'

export default async (opts: {
	method: 'GET' | 'POST' | 'DELETE'
	uid: string
	reaction: ReactionType
}): Promise<OOAPIResult<OOReaction>> => {
	const { method, uid, reaction } = opts

	return api<OOReaction>({
		resource: 'projects',
		pathParameter: `${uid}/reactions/${reaction}`,
		method
	})
}
