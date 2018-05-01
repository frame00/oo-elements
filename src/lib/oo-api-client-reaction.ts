import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOReaction } from '../type/oo-reaction'
import { ReactionType } from '../type/reaction-type'

type Method = 'GET' | 'POST' | 'DELETE'
type Result<T> = T extends 'GET' ? OOReaction : boolean

export default async <T>(opts: {
	method: Method
	uid: string
	reaction: ReactionType
}): Promise<OOAPIResult<Result<T>>> => {
	const { method, uid, reaction } = opts

	return api<Result<T>>({
		resource: 'projects',
		pathParameter: `${uid}/reactions/${reaction}`,
		method
	})
}
