import { initializeApp } from 'firebase'
import config from '../conf/firebase'

const state: Map<'initialized', boolean> = new Map()
const initialize = (): void => {
	if (state.get('initialized') !== true) {
		initializeApp(config)
		state.set('initialized', true)
	}
}

export default (): void => initialize()
