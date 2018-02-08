import {html, render} from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'

interface HTMLOptions {
	found: boolean,
	scope: Scope
}

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectFound = weakMap<boolean>()
const projectUid = weakMap<string>()
const projectScope = weakMap<Scope>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		projectUid.set(this, next)
		this.fetchProject(projectUid.get(this))
	}

	html(opts: HTMLOptions) {
		const {found, scope} = opts
		if (found === false) {
			return html``
		}

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: inline-block;
			}
			span {
				padding: 0.2rem 1rem;
				border-radius: 5px;
				color: white;
				text-transform: capitalize;
				font-family: var(--font-family);
				&.public {
					background: #4CAF50;
				}
				&.private {
					background: #607D8B;
				}
			}
		</style>
		<span class$='${scope}'>${scope}</span>
		`
	}

	render() {
		render(this.html({
			found: projectFound.get(this),
			scope: projectScope.get(this)
		}), this)
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response, status} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectFound.set(this, true)
			projectScope.set(this, mapedExtensions.get('scope'))
		} else {
			projectFound.set(this, false)
		}
		this.render()
	}
}
