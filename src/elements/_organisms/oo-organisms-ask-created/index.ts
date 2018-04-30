import { OOElement } from '../../oo-element'
import { html } from '../../../lib/html'
import summary from '../../oo-project-summary'
import define from '../../../lib/define'

define('oo-project-summary', summary)

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
		const projectUrl = `https://ooapp.co/project/${uid}`
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			@import '../../../style/_mixin-button.css';
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
			section {
				max-width: 640px;
			}
			a {
				@mixin button;
				display: block;
				margin-bottom: 1rem;
				text-decoration: none;
				color: inherit;
			}
			small {
				font-size: 0.8rem;
				font-weight: 700;
			}
		</style>
		<main>
			<section>
				<oo-project-summary data-uid$='${uid}'></oo-project-summary>
				<small>Sharing URL</small>
				<a class=project href$='${projectUrl}' target=_blank rel=noopener>${projectUrl}</a>
				<small>Edit profile</small>
				<a class=profile href='https://ooapp.co/dashboard' target=_blank rel=noopener>Change your profile</a>
			</section>
		</main>
		`
	}
}
