import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOExtensionsLikeObject } from '../type/oo-extension'
import { OOUser } from '../type/oo-user'
import createExtensions from './create-extensions'

export default async (
	uid: string,
	extensions: OOExtensionsLikeObject
): Promise<OOAPIResult<OOUser>> => {
	const ext = createExtensions(extensions)
	const ooapiRes = await api<OOUser>({
		resource: 'users',
		pathParameter: uid,
		method: 'PATCH',
		body: {
			Extensions: ext
		}
	})

	return ooapiRes
}
