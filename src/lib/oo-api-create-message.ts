import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOMessage } from '../type/oo-message'
import { MessageOptionsPost } from '../type/oo-options-message'
import createExtensions from './create-extensions'

export default async (
	options: MessageOptionsPost,
	test?: boolean
): Promise<OOAPIResult<OOMessage>> => {
	if (test === false) {
		return {
			response: { message: 'error' },
			headers: new Headers(),
			status: 500
		}
	}
	const extensions = createExtensions(options)

	return api<OOMessage>({
		resource: 'messages',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})
}
