import {OOElement} from '../../oo-element'
import {html} from '../../../lib/html'

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		projectUid.set(this, next)
		this.update()
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const uid = projectUid.get(this)
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			:host {
				display: block;
				height: 100%;
			}
			main {
				display: flex;
				height: 100%;
				font-family: var(--font-family);
				align-items: center;
				flex-direction: column;
				justify-content: center;
			}
			a {
				text-decoration: none;
				color: inherit;
			}
			.project {
				font-size: 2rem;
			}
			.profile {}
		</style>
		<main>
			<p class=project>
				<a href$='https://ooapp.co/project/${uid}' target=_blank rel=noopener>Created project</a>
			</p>
			<p class=profile>
				<a href='https://ooapp.co/dashboard' target=_blank rel=noopener>View your profile</a>
			</p>
		</main>
		`
	}
}
