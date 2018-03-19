import {OOElement} from '../oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {TemplateResult} from 'lit-html'
import {html} from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import {href} from '../../lib/href'

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectFound = weakMap<boolean>()
const projectUid = weakMap<string>()
const projectScope = weakMap<Scope>()
const projectForked = weakMap<string>()

export default class extends OOElement {
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

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const {found, scope, fork} = {
			found: projectFound.get(this),
			scope: projectScope.get(this),
			fork: projectForked.get(this)
		}
		if (found === false) {
			return html``
		}
		const labels: Array<TemplateResult> = []
		if (fork) {
			labels.push(html`<a class=forked href$='${href(`/project/${fork}`)}'>↩ fork</a>`)
		}
		if (scope) {
			labels.push(html`<span class$='${scope}'>${scope}</span>`)
		}

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: inline-block;
			}
			span,
			a {
				display: inline-block;
				padding: 0.2rem 0.6rem;
				border-radius: 5px;
				color: white;
				font-size: 0.8rem;
				text-transform: capitalize;
				font-family: var(--font-family);
				&:not(:last-child) {
					margin-right: 0.5rem;
				}
				&.public {
					background: #4CAF50;
				}
				&.private {
					background: #607D8B;
				}
				&.unassigned {
					background: #3F51B5;
				}
				&.forked {
					background: rebeccapurple;
				}
			}
		</style>
		${repeat(labels, label => label)}
		`
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectFound.set(this, true)
			projectScope.set(this, mapedExtensions.get('scope'))
			projectForked.set(this, mapedExtensions.get('fork'))
		} else {
			projectFound.set(this, false)
		}
		this.update()
	}
}
