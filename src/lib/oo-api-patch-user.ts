import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOExtensionsLikeObject} from '../d/oo-extension'
import {OOUser} from '../d/oo-user'
import createExtensions from './create-extensions'

export default async (uid: string, extensions: OOExtensionsLikeObject): Promise<OOAPIResult<OOUser>> => {
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
