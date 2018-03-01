import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import define from '../../lib/define'
import markdown from '../oo-markdown'
import message from '../_atoms/oo-atoms-message'
import userName from '../_atoms/oo-atoms-user-name'
import datetime from '../_atoms/oo-atoms-datetime'
import projectStatus from '../oo-project-status'

define('oo-markdown', markdown)
define('oo-atoms-message', message)
define('oo-atoms-user-name', userName)
define('oo-atoms-datetime', datetime)
define('oo-project-status', projectStatus)

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()
const projectBody: WeakMap<object, string> = new WeakMap()
const projectAuthor: WeakMap<object, string> = new WeakMap()
const projectCreated: WeakMap<object, number> = new WeakMap()

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
		const {uid, created, body, author} = {
			uid: projectUid.get(this),
			created: projectCreated.get(this),
			body: projectBody.get(this),
			author: projectAuthor.get(this)
		}
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-heading.css';
			:host {
				display: block;
			}
			section {
				padding: 1.5rem;
				p {
					margin: 0;
					&:not(:last-child) {
						margin-bottom: 1rem;
					}
				}
			}
			h2 {
				@mixin heading;
				font-family: var(--font-family);
			}
			dl {
				margin: 0 0 1rem;
				font-family: var(--font-family);
				display: flex;
				flex-wrap: wrap;
				font-size: 0.9rem;
				dt {
					width: 30%;
					margin-bottom: 0.2rem;
					font-weight: 300;
				}
				dd {
					margin: 0;
					width: 70%;
				}
			}
			oo-project-status {
				margin-bottom: 0.5rem;
			}
			.amount {
				text-transform: uppercase;
			}
		</style>
		<main>
			<oo-atoms-message data-tooltip-position=left>
				<section slot=body>
					<oo-project-status data-uid$='${uid}'></oo-project-status>
					<oo-markdown>${body}</oo-markdown>
				</section>
				<footer slot=footer>
					<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
					<oo-atoms-datetime data-unixtime='${created}'></oo-atoms-datetime>
				</footer>
			</oo-atoms-message>
		</main>
		`
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectCreated.set(this, item.created)
			projectBody.set(this, mapedExtensions.get('body'))
			projectAuthor.set(this, mapedExtensions.get('author'))
		} else {
			projectBody.delete(this)
			projectAuthor.delete(this)
		}
		this.update()
	}
}
