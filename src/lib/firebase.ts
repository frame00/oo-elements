import {Firebase} from '../d/firebase'
import {cdnSource} from '../conf/firebase'
const {document} = window

declare global {
	interface Window {
		firebase: Firebase
	}
}

const load = (callback: (firebase: Firebase) => void): void => {
	if (!('firebase' in window)) {
		const script = document.createElement('script')
		script.src = cdnSource
		script.onload = () => {
			callback(window.firebase)
		}
		document.body.appendChild(script)
	} else {
		callback(window.firebase)
	}
}

export default async (): Promise<Firebase> => {
	const f = await new Promise<Firebase>(resolve => {
		load(firebase => {
			resolve(firebase)
		})
	})
	return f
}
