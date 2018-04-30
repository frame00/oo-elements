import { oAuthUrl } from '../conf/stripe'
import store from '../lib/local-storage'
const { open } = window

export default (): Window => {
	const { uid } = store
	const url = `${oAuthUrl}&state=${uid}`
	return open(url, '_blank')
}
