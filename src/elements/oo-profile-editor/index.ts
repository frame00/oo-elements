import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import toMap from '../../lib/extensions-to-map'
import lineBreak from '../../lib/line-break'
import weakMap from '../../lib/weak-map'

interface Options {
	iam: string
}

const ATTR = {
	DATA_IAM: 'data-iam'
}

const stateIam = weakMap<string>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateIam.set(this, next)
		this.fetchUserData()
	}

	html(opts: Options) {
		return html`
		<style>
		</style>
		`
	}

	render() {
		const opts = {
			iam: stateIam.get(this)
		}
		render(this.html(opts), this)
	}

	async fetchUserData() {
		const res = await getUser(stateIam.get(this))
		const {response} = res
		if (Array.isArray(response)) {
			const [item] = response
			const ext = toMap(item)
			this.render()
		} else {
			this.render()
		}
	}
}
