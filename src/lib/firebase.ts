import {Firebase} from '../d/firebase'
const {document} = window

declare global {
	interface Window {
		firebase: Firebase
	}
}

const load = (callback: (firebase: Firebase) => void): void => {
	if (!('firebase' in window)) {
		const script = document.createElement('script')
		script.src = 'https://www.gstatic.com/firebasejs/4.8.1/firebase.js'
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
